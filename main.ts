import { NseIndia } from "npm:stock-nse-india@1.2.0";

const nseIndia = new NseIndia();

async function returnStockPrice(tickerName: string): Promise<number> {
    try {
        const details = await nseIndia.getEquityDetails(tickerName);
        return details.priceInfo.lastPrice; // Ensure this property exists
    } catch (error) {
        console.error("Error fetching stock price:", error);
        return NaN; // Return NaN or handle as needed
    }
}

async function avgDownCalc(lastTradedPrice: number, targetPrice: number, sharePrice: number, numberOfShares: number) {

	// catch the user error if target price is already achived
	try {
		if (targetPrice <= lastTradedPrice ) {
			prompt("Target price already achived");	
			return 0;
		}
		else {
			return ((sharePrice*numberOfShares - (targetPrice*numberOfShares))/(targetPrice - lastTradedPrice))
		}
	} catch (error) {
		console.error("Error calcuating no of new shares need:", error);
        return NaN; // Return NaN or handle as needed
	}
}

if (import.meta.main) {
    const tickerName: string = prompt('Please enter stock ticker');
    const tickerNameUpperCase: string = tickerName.toUpperCase();
    const sharePrice: number = Number.parseInt(prompt("Please tell us the price at which you bought: "));
    const numberOfShares: number = Number.parseInt(prompt("Please tell us how many shares you bought: "));
    const targetPrice: number = Number.parseInt(prompt("Please tell us the target price: "));

    // Await the stock price
    const lastTradedPrice: number = await returnStockPrice(tickerNameUpperCase);

    if (!isNaN(lastTradedPrice)) {
        console.log(`Last traded price for ${tickerNameUpperCase}: ${lastTradedPrice}`);
    } else {
        console.log("Could not fetch the last traded price.");
    }

	const additionalBuyFloat: number = await avgDownCalc(lastTradedPrice, targetPrice, sharePrice, numberOfShares);
	const additionalBuyInt: number = ~~additionalBuyFloat;

	prompt(`To average out to the stock price at ${targetPrice} please buy additional ${additionalBuyInt} shares at ${lastTradedPrice}`);
}
