
import { GoogleGenAI, Type } from "@google/genai";
import { StockData, OptionData, MarketInsight } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Interface for the internal search response with grounding metadata
 */
interface SearchResponse extends StockData {
  sources?: { title: string; uri: string }[];
}

/**
 * Busca dados reais da B3 (preço, nome e variação) usando busca do Google
 */
export const fetchStockDataFromB3 = async (ticker: string): Promise<SearchResponse> => {
  try {
    const prompt = `Encontre o preço atual de fechamento ou cotação em tempo real, o nome oficial da empresa e a variação percentual do dia para o ticker ${ticker} na B3 (Brasil). 
    Responda APENAS com um objeto JSON válido, sem qualquer texto adicional ou formatação Markdown.
    Formato: {"ticker": "${ticker}", "name": "Nome da Empresa", "currentPrice": 0.00, "change": 0.00, "changePercent": 0.00}. Use ponto (.) como separador decimal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Você é um assistente financeiro especializado na B3. Sempre retorne DADOS EM FORMATO JSON PURO, SEM TEXTO ADICIONAL, SEM INTRODUÇÕES OU CONCLUSÕES. Garanta que números decimais usem ponto (.).",
      }
    });

    const rawText = response.text || '';
    console.log(`[${ticker}] Gemini Raw Response:`, rawText); // Log raw response

    // Step 1: Clean up the raw text to isolate potential JSON
    let cleanedText = rawText.trim();
    // Remove markdown code blocks (```json ... ```)
    if (cleanedText.startsWith('```json') && cleanedText.endsWith('```')) {
      cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
    } else if (cleanedText.startsWith('```') && cleanedText.endsWith('```')) { // generic markdown block
      cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
    }
    
    // Step 2: Replace comma decimal separators with dots for robust parseFloat
    // This regex looks for a digit, followed by a comma, followed by one or more digits, ensuring it's a decimal number.
    cleanedText = cleanedText.replace(/(\d),(\d+)/g, '$1.$2');

    console.log(`[${ticker}] Cleaned & Decimal-Corrected Text for JSON parsing:`, cleanedText); // Log cleaned text after decimal correction

    let result: any;
    try {
      result = JSON.parse(cleanedText);
    } catch (parseError) {
      console.warn(`[${ticker}] Primeira tentativa de JSON.parse falhou após limpeza e correção decimal. Erro:`, parseError);
      // Fallback: try to extract a JSON object using regex if direct parse fails
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          result = JSON.parse(jsonMatch[0]);
          console.log(`[${ticker}] JSON extraído via regex e parseado com sucesso.`);
        } catch (extractParseError) {
          console.error(`[${ticker}] Erro ao extrair e fazer parse do JSON via regex:`, extractParseError);
          throw new Error("Resposta da IA não contém JSON válido após extração e limpeza.");
        }
      } else {
        throw new Error("Resposta da IA não contém um objeto JSON válido ou detectável.");
      }
    }
    
    // Extract grounding sources as required by Google Search grounding rules
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter(Boolean) || [];

    // Ensure numeric types and provide defaults for missing/invalid fields
    const currentPrice = parseFloat(String(result.currentPrice).replace(',', '.')) || 0;
    const change = parseFloat(String(result.change).replace(',', '.')) || 0;
    const changePercent = parseFloat(String(result.changePercent).replace(',', '.')) || 0;

    const finalResult: SearchResponse = {
      ticker: (result.ticker || ticker).toUpperCase(),
      name: result.name || "Empresa Desconhecida",
      currentPrice: currentPrice,
      change: change,
      changePercent: changePercent,
      sources: sources
    };

    console.log(`[${ticker}] Final Parsed Stock Data:`, finalResult); // Log final parsed result

    return finalResult;

  } catch (error: any) {
    if (error.status === 429) { // Catch RESOURCE_EXHAUSTED specifically
      console.warn(`[${ticker}] Erro 429 (RESOURCE_EXHAUSTED) ao buscar dados da B3:`, error.message);
      throw new Error("API_QUOTA_EXCEEDED"); // Custom error for App.tsx to handle
    }
    console.error(`[${ticker}] Erro detalhado ao buscar dados da B3:`, error.message || error);
    return {
      ticker: ticker.toUpperCase(),
      name: "Erro na Busca",
      currentPrice: 0,
      change: 0,
      changePercent: 0,
      sources: []
    };
  }
};

export const getMarketInsights = async (
  stock: StockData,
  options: OptionData[]
): Promise<MarketInsight> => {
  try {
    const prompt = `Analise os seguintes dados do mercado de opções para a ação ${stock.ticker} (${stock.name}).
    Preço atual: R$ ${stock.currentPrice.toFixed(2)} (${stock.changePercent.toFixed(2)}%).
    
    Opções geradas para análise:
    ${options.map(o => `- ${o.type} Strike R$ ${o.strike.toFixed(2)} | Status: ${o.status}`).join('\n')}
    
    Explique o cenário atual de volatilidade e liquidez. Forneça um resumo do sentimento e uma recomendação.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ["bullish", "bearish", "neutral"] },
            recommendation: { type: Type.STRING }
          },
          required: ["summary", "sentiment", "recommendation"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as MarketInsight;
  } catch (error: any) {
    if (error.status === 429) { // Catch RESOURCE_EXHAUSTED specifically
      console.warn(`Erro 429 (RESOURCE_EXHAUSTED) ao buscar insights do Gemini:`, error.message);
      throw new Error("API_QUOTA_EXCEEDED"); // Custom error for App.tsx to handle
    }
    console.error("Erro ao buscar insights do Gemini:", error);
    return {
      summary: "Análise indisponível temporariamente.",
      sentiment: "neutral",
      recommendation: "Aguarde a atualização dos dados de mercado."
    };
  }
};
