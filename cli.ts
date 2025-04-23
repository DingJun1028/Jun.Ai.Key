#!/usr/bin/env ts-node
import { Command } from 'commander';
import { integrateWithBoostSpace } from './boost_space_integration';
import { logger } from './logger';
import { initProject } from './init';
const program = new Command();
program
  .version('1.0.0')
  .description('Jun.Ai.Key CLI for integrating with Boost.space')
  .option('--config <path>', 'Path to config file', 'config.json')
  .option('--dry-run', 'Run the integration without writing to Boost.space')
  .option('--verbose', 'Enable verbose logging')
  .option('--init', 'Initialize the project with default configuration')
  .parse(process.argv);
const options = program.opts();
if (options.verbose) {
  logger.level = 'debug';
}
(async () => {
  try {
    if (options.init) {
      await initProject();
      logger.info('Project initialized with default configuration.');
    } else if (options.dryRun) {
      logger.info('Dry run mode enabled. No data will be written.');
    } else {
      await integrateWithBoostSpace(options.config);
    }
  } catch (error) {
    logger.error('Operation failed', error);
    process.exit(1);
  }
})();