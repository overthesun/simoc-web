import argparse
from os import wait
import time
import multiprocessing

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
            dc['goog:loggingPrefs'] = { 'browser':'ALL' }

            driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options, desired_capabilities=dc)
            return driver
        case _:
            print("Browser not currently targeted")


def run_sim(browser, days):
    global select_browser
    driver = select_browser(browser)

    print(multiprocessing.current_process().name+" has started")

    driver.get("https://beta.simoc.space")

    driver.find_element(By.XPATH, '//button[text()="PROCEED"]').click()

    driver.implicitly_wait(2)
    driver.find_element(By.ID, 'guest-login').click()

    wait = WebDriverWait(driver, 10)
    sign_in_button = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[text()="SIGN IN AS GUEST"]')))
    sign_in_button.click()

    driver.find_element(By.XPATH, '//button[text()="NEW CONFIGURATION"]').click()


    sim_options = Select(driver.find_element(By.XPATH, '/html/body/div[1]/div/div[2]/div/div/section[1]/main/form/section/form/label/div[3]/div/select'))
    sim_options.select_by_value('sam_one_human_garden')

    sim_days = driver.find_element(By.CLASS_NAME, 'input-field-number')
    sim_days.clear()
    sim_days.send_keys(days)

    plant_options = Select(driver.find_element(By.XPATH, '/html/body/div[1]/div/div[2]/div/div/section[1]/main/form/section/div[3]/label[2]/div[3]/select'))
    plant_options.select_by_value('wheat')
    plant_options.select_by_value('rice')

    driver.find_element(By.CLASS_NAME, 'btn-launch').click()

    print("Sim for "+multiprocessing.current_process().name+" has launched")

    time.sleep(240)

    steps = int(days) * 24 
    message = str(steps)+"/"+str(steps)+" steps sent by the server"
    found = False

    for log in driver.get_log('browser'):
        if message in log['message']:
            print("Sim "+multiprocessing.current_process().name+" was successful")
            found = True
        else:
            continue

    if found is not True:
        print("Sim "+multiprocessing.current_process().name+ " failed")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--processes', '-p', type=int, default=1, help='Number of processes to run')
    parser.add_argument('--days', '-d', type=str, default='100', help='Number of days for sim to run. Min of 1 and max of 365')
    parser.add_argument('--browser', '-b', type=str, default='chrome', help='Select browser to run SIMOC in')

    args = parser.parse_args()

    process = [multiprocessing.Process(target=run_sim, kwargs={'browser':args.browser,'days':args.days}) for _ in range(args.processes)]

    for p in process:
        p.start()


if __name__ == '__main__':
    main()

