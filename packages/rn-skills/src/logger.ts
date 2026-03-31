const RESET = '\u001B[0m';
const BOLD = '\u001B[1m';
const DIM = '\u001B[2m';
const CYAN = '\u001B[36m';
const GREEN = '\u001B[32m';
const MAGENTA = '\u001B[35m';
const RED = '\u001B[31m';
const YELLOW = '\u001B[33m';

export function printBanner(): void {
  process.stdout.write(
    `${MAGENTA}${BOLD}` +
      '██████╗ ███╗   ██╗    ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗\n' +
      '██╔══██╗████╗  ██║    ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝\n' +
      '██████╔╝██╔██╗ ██║    ███████╗█████╔╝ ██║██║     ██║     ███████╗\n' +
      '██╔══██╗██║╚██╗██║    ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║\n' +
      '██║  ██║██║ ╚████║    ███████║██║  ██╗██║███████╗███████╗███████║\n' +
      '╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝\n' +
      `${RESET}${DIM}RN Skills by Callstack${RESET}\n\n`,
  );
}

export function info(message: string): void {
  process.stdout.write(`${CYAN}info${RESET} ${message}\n`);
}

export function success(message: string): void {
  process.stdout.write(`${GREEN}success${RESET} ${message}\n`);
}

export function warn(message: string): void {
  process.stdout.write(`${YELLOW}warn${RESET} ${message}\n`);
}

export function error(message: string): void {
  process.stderr.write(`${RED}error${RESET} ${message}\n`);
}

export function section(title: string): void {
  process.stdout.write(`\n${BOLD}${title}${RESET}\n`);
}
