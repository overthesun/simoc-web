import time
import argparse
import multiprocessing

from os import wait

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from webdriver_manager.chrome import ChromeDriverManager


def select_browser(browser):
    # TODO need to add browser support for different browsers and move
    # the chrome options and webdriver install out of run_sim() and
    # into this function and return browser to the function
    # Due to different browser architecture loggin, browser settings,
    # and a few other quirks need to be worked out to ensure compat
    match browser:
        case 'chrome':
            chrome_options = ChromeOptions()
            chrome_options.add_argument('--incognito')
            chrome_options.add_argument('--disable-extenstions')
            #chrome_options.add_argument('--headless')

            dc = DesiredCapabilities.CHROME
            dc['goog:loggingPrefs'] = {'browser': 'ALL'}

            service = ChromeService(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options,
                                      desired_capabilities=dc)
            return driver
        case _:
            print("Browser not currently targeted")


def run_sim(browser, days):
    driver = select_browser(browser)

    print(f'{multiprocessing.current_process().name} has started")

    driver.get("https://beta.simoc.space")

    driver.find_element(By.XPATH, '//button[text()="PROCEED"]').click()

    driver.implicitly_wait(2)
    driver.find_element(By.ID, 'guest-login').click()

    wait = WebDriverWait(driver, 10)
    sign_in_path = '//button[text()="SIGN IN AS GUEST"]'
    cond = EC.element_to_be_clickable((By.XPATH, sign_in_path))
    sign_in_button = wait.until(cond)
    sign_in_button.click()

    driver.find_element(By.XPATH, '//button[text()="NEW CONFIGURATION"]').click()


    presets_path = '//div[contains(@class, 'presets-dropdown')]/select'
    sim_options = Select(driver.find_element(By.XPATH, presets_path))
    sim_options.select_by_value('sam_one_human_garden')

    sim_days = driver.find_element(By.CLASS_NAME, 'input-field-number')
    sim_days.clear()
    sim_days.send_keys(days)

    plant_path = '//div[contains(@class, 'input-plant-wrapper')]/select'
    plant_options = Select(driver.find_element(By.XPATH, plant_path))
    plant_options.select_by_value('wheat')
    plant_options.select_by_value('rice')

    driver.find_element(By.CLASS_NAME, 'btn-launch').click()

    print(f"Sim for {multiprocessing.current_process().name} has launched")

    time.sleep(240)

    steps = int(days) * 24 
    message = f"/{steps} steps sent by the server"
   for log in driver.get_log('browser'):
        if message in log['message']:
            print("Step message found:", log['message'])
            if f'{steps}/{steps}' in log['message']:
                print(f"Sim {multiprocessing.current_process().name} was successful")
            else:
                print(f"Sim {multiprocessing.current_process().name} failed")
            break
    else:
        print(f"Sim {multiprocessing.current_process().name} failed")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--processes', '-p', type=int, default=1,
                        help='Number of processes to run')
    parser.add_argument('--days', '-d', type=str, default='100',
                        help='Number of days for sim to run. Min of 1 and max of 365')
    parser.add_argument('--browser', '-b', type=str, default='chrome',
                        help='Select browser to run SIMOC in')

    args = parser.parse_args()
    kwargs = {'browser': args.browser, 'days': args.days}
    processes = [multiprocessing.Process(target=run_sim, kwargs=kwargs)
                 for _ in range(args.processes)]
    for p in processes:
        p.start()


if __name__ == '__main__':
    main()

