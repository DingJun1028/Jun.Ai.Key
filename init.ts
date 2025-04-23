import { writeConfig } from './utils';
import { logger } from './logger';
export async function initProject() {
  const defaultConfig = {
    dataMapping: {
      scriptName: 'script_name',
      scriptDescription: 'script_description',
      scriptCode: 'script_code',
    },
  };
  await writeConfig('config.json', defaultConfig);
  logger.info('Default configuration file created at config.json');
}