import yfinance as yf
import pandas as pd


def get_moving_averages(ticker_symbol, short_window=8, long_window=50):
    """
    Calculate moving averages for a given stock
    
    Parameters:
    ticker_symbol (str): Stock ticker symbol
    short_window (int): Short-term moving average window (default: 8)
    long_window (int): Long-term moving average window (default: 50)
    """
    tickers = [ticker.strip().upper() for ticker in ticker_input.split(',')]
    
    results = {}
    
    for ticker_symbol in tickers:
        try:
            # Get stock data
            stock = yf.Ticker(ticker_symbol)
            # Get historical data for the past year
            hist = stock.history(period="1y")
            
            # Calculate moving averages
            hist[f'MA{short_window}'] = hist['Close'].rolling(window=short_window).mean()
            hist[f'MA{long_window}'] = hist['Close'].rolling(window=long_window).mean()
            
            # Get the most recent values
            latest_short_ma = hist[f'MA{short_window}'].iloc[-1]
            latest_long_ma = hist[f'MA{long_window}'].iloc[-1]
            latest_price = hist['Close'].iloc[-1]
            
            print(f"\nLatest {ticker_symbol} Statistics:")
            print(f"Current Price: ${latest_price:.2f}")
            print(f"{short_window}-day Moving Average: ${latest_short_ma:.2f}")
            print(f"{long_window}-day Moving Average: ${latest_long_ma:.2f}")
            
            results[ticker_symbol] = {
                'current_price': latest_price,
                f'MA{short_window}': latest_short_ma,
                f'MA{long_window}': latest_long_ma,
                'history': hist
            }
            
        except Exception as e:
            print(f"\nError processing {ticker_symbol}: {str(e)}")
    
    return results

if __name__ == "__main__":
    # Example usage with multiple tickers
    ticker_input = input("Enter ticker symbols (comma-separated, e.g., META,AAPL,GOOGL): ")
    get_moving_averages(ticker_input)