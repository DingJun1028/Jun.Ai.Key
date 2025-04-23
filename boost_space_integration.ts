import fetch from 'node-fetch';
import { logger } from './logger';
import { retry } from './retry';
import { readConfig, getScriptingAppData } from './utils';
export async function integrateWithBoostSpace(configPath: string) {
  const config = await readConfig(configPath);
  const data = await getScriptingAppData('exampleKey');
  const record = Object.entries(config.dataMapping).reduce((acc, [key, value]) => {
    acc[value] = data[key];
    return acc;
  }, {} as Record<string, string>);
  const response = await retry(() =>
    fetch(process.env.BOOST_SPACE_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOOST_API_KEY}`,
      },
      body: JSON.stringify({ records: [record] }),
    })
  , 3, 1000);
  if (!response.ok) {
    logger.error(`Failed to write to Boost.space: ${response.statusText}`);
    throw new Error('API request failed');
  }
  logger.info('Data successfully written to Boost.space');
}