const COMMAND_ARGS_LOG_MAX_LENGTH = 100

export function formatCommandArgsForLog(args: string): string {
  if (args.length <= COMMAND_ARGS_LOG_MAX_LENGTH) {
    return args
  }

  return `${args.slice(0, COMMAND_ARGS_LOG_MAX_LENGTH)}… (${args.length} chars)`
}
