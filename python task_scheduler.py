import schedule
import time
import logging
import os
import threading
from datetime import datetime

# 設定日誌
LOG_FILE = "task_scheduler.log"
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

def task_to_run():
    try:
        logging.info("自動執行任務開始")
        logging.info("執行完成！")
    except Exception as e:
        logging.error(f"任務執行失敗: {e}")

def another_task():
    try:
        logging.info("執行另一個任務開始")
        logging.info("另一個任務執行完成！")
    except Exception as e:
        logging.error(f"另一個任務執行失敗: {e}")

def run_task_in_thread(task):
    threading.Thread(target=task).start()

def setup_schedule():
    schedule_interval = int(os.getenv("SCHEDULE_INTERVAL", 5))
    schedule.every(schedule_interval).minutes.do(run_task_in_thread, task_to_run)
    schedule.every(5).minutes.do(run_task_in_thread, task_to_run)
    schedule.every().hour.do(run_task_in_thread, another_task)

def main():
    print("自動執行服務已啟動...")
    logging.info("自動執行服務已啟動")
    setup_schedule()
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        logging.info("自動執行服務已停止")
        print("自動執行服務已停止")
    except Exception as e:
        logging.error(f"服務執行期間發生錯誤: {e}")
    finally:
        logging.info("服務已安全退出")

if __name__ == "__main__":
    main()