from flask import Flask, jsonify
from flask_cors import CORS
import yfinance as yf

app = Flask(__name__)
CORS(app)

def get_moving_averages(ticker_input):
    """
    Calculate 8-day and 50-day moving averages for given stocks
    """
    tickers = [ticker.strip().upper() for ticker in ticker_input.split(',')]
    response_data = {
        'success': True,
        'data': {},
        'errors': []
    }
    
    for ticker_symbol in tickers:
        try:
            # Get stock data
            stock = yf.Ticker(ticker_symbol)
            hist = stock.history(period='3mo')  # Get enough data for 50-day MA
            
            if hist.empty:
                response_data['errors'].append({
                    'ticker': ticker_symbol,
                    'error': 'No data available for the given ticker symbol'
                })
                continue
            
            # Calculate moving averages
            ma8 = hist['Close'].rolling(window=8).mean().iloc[-1]
            ma50 = hist['Close'].rolling(window=50).mean().iloc[-1]
            
            response_data['data'][ticker_symbol] = {
                'MA8': round(ma8, 2),
                'MA50': round(ma50, 2)
            }
            
        except Exception as e:
            response_data['errors'].append({
                'ticker': ticker_symbol,
                'error': str(e)
            })
    
    if len(response_data['errors']) > 0:
        response_data['success'] = False
    
    return response_data

@app.route('/api/stock-analysis/<tickers>')
def analyze_stocks(tickers):
    try:
        if not tickers:
            return jsonify({
                'success': False,
                'error': 'No ticker symbols provided'
            }), 400
            
        result = get_moving_averages(tickers)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
