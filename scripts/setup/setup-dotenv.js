import fs from 'node:fs'

import inquirer from 'inquirer'

import { LogHelper } from '@/helpers/log-helper'

/**
 * Duplicate the .env.sample to .env file
 */
export default () =>
  new Promise(async (resolve) => {
    LogHelper.info('.env file creation...')

    const createDotenv = () => {
      fs.createReadStream('.env.sample').pipe(fs.createWriteStream('.env'))

      LogHelper.success('.env file created')
    }

    if (!fs.existsSync('.env')) {
      createDotenv()

      resolve()
    } else if (process.env.IS_DOCKER === 'true') {
      resolve()
    } else {
      const answer = await inquirer.prompt({
        type: 'confirm',
        name: 'dotenv.overwrite',
        message: '.env file already exists, overwrite:',
        default: false
      })

      if (answer.dotenv.overwrite === true) {
        createDotenv()
      }

      resolve()
    }
  })
