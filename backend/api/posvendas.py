import gspread
from oauth2client.service_account import ServiceAccountCredentials
from flask import Flask, jsonify
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
import logging
import json
from datetime import datetime

# Configuração de logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)

# Configurações do Google Sheets
scope = ["https://spreadsheets.google.com/feeds", 'https://www.googleapis.com/auth/spreadsheets',
         "https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive"]

creds = ServiceAccountCredentials.from_json_keyfile_name('keys/backup-ti-426913-2d9d57342f77.json', scope)
client = gspread.authorize(creds)

# Nome da planilha e da aba
spreadsheet_name = "PÓS-VENDAS (DISPONIBILIDADE VENDAS - ITAPEMA)"
sheet_name = "Pós-Vendas"

# Inicializa as variáveis globais
data = {}

def is_valid_date(date_string):
    try:
        datetime.strptime(date_string, '%d/%m/%Y')
        return True
    except ValueError:
        return False

def fetch_sheet_data():
    logging.debug("Iniciando a busca de dados da planilha.")
    global data
    try:
        sheet = client.open(spreadsheet_name).worksheet(sheet_name)
        logging.debug("Planilha e aba abertas com sucesso.")
        records = sheet.get_all_records()
        logging.debug(f"{len(records)} registros encontrados.")

        # Filtra os registros com base na data de realização
        filtered_records = []
        current_date = datetime.now()

        for record in records:
            hire_date_str = record.get('Data Real.', '')
            event_code = record.get('Cód', 'N/A')
            if hire_date_str and is_valid_date(hire_date_str):
                try:
                    hire_date = datetime.strptime(hire_date_str, '%d/%m/%Y')
                    if hire_date >= current_date:
                        filtered_records.append(record)
                except ValueError as e:
                    logging.error(f"Erro ao analisar a data de realização: {hire_date_str} - Código do Evento: {event_code}", exc_info=True)
            else:
                logging.warning(f"Data de realização está vazia ou inválida: {hire_date_str} - Código do Evento: {event_code}")
        
        data = filtered_records
        logging.debug("Dados atualizados com sucesso.")
    except Exception as e:
        logging.error("Erro ao buscar dados da planilha.", exc_info=True)

@app.route('/data', methods=['GET'])
def get_data():
    logging.debug("Recebida solicitação para /data.")
    return jsonify(data)

if __name__ == '__main__':
    logging.debug("Script iniciado.")
    fetch_sheet_data()  # Buscar dados inicialmente

    # Configuração do scheduler para atualizar os dados a cada 15 minutos
    scheduler = BackgroundScheduler()
    scheduler.add_job(fetch_sheet_data, 'interval', minutes=15)
    scheduler.start()
    logging.debug("Scheduler iniciado para atualizar os dados a cada 15 minutos.")

    # Executa o servidor Flask com HTTP
    app.run(host='0.0.0.0', port=5002)
    logging.debug("Servidor Flask iniciado na porta 5002 com HTTP.")
