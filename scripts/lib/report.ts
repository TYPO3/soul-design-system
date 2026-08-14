/* One voice for every task in this repository.

   A task opens with its name, prints rows a reader scans down rather than
   reads, and closes with a verdict. Colour is a terminal affordance and
   carries nothing on its own: piped, redirected or in CI the same characters
   say the same thing.

   `SDS_REPORT=1` switches a task to the contract `verify` reads — the first
   line is its facts, every line after it is detail the gate shows only when
   the task failed. Set it by hand to see exactly what the gate sees. */

/** No colour without a terminal, and none when asked to keep quiet about it —
    `NO_COLOR` is the convention every tool that paints its output honours. */
const plain = !process.stdout.isTTY || Boolean(process.env.NO_COLOR) || process.env.TERM === 'dumb';
const paint = (code: string) => (text: string): string => (plain ? text : `\x1b[${code}m${text}\x1b[0m`);

export const bold = paint('1');
export const dim = paint('2');

export type State = 'ok' | 'bad' | 'warn' | 'skip';

const MARK: Record<State, string> = {
  ok: paint('32')('✓'),
  bad: paint('31')('✗'),
  warn: paint('33')('!'),
  skip: dim('·'),
};

/** Under the gate a task speaks the contract above and prints nothing else —
    no title, no rows, only its facts line and whatever went wrong. */
export const REPORTING = process.env.SDS_REPORT === '1';

/* The two columns every row shares. Set from the whole list before the first
   row, so the facts line up down the page instead of following the longest
   label on the way past. */
let nameWidth = 0;
let labelWidth = 0;

export function align(rows: readonly { name: string; label: string }[]): void {
  nameWidth = Math.max(0, ...rows.map((r) => r.name.length));
  labelWidth = Math.max(0, ...rows.map((r) => r.label.length));
}

/* Whether anything has been said since the title. A task that found nothing
   worth a line closes straight under it rather than on an empty one. */
let spoke = false;

/** The task's opening line: what ran, and what it is for. */
export function open(task: string, what: string): void {
  if (REPORTING) return;
  console.log(`${bold('soul')} ${dim('·')} ${task} ${dim('·')} ${dim(what)}`);
  console.log();
}

/** One check, one line: its verdict, its name, what it holds, its numbers. */
export function row(state: State, name: string, label: string, facts = ''): void {
  if (REPORTING) return;
  const head = `  ${MARK[state]}  ${name.padEnd(nameWidth)}  ${label.padEnd(labelWidth)}`;
  spoke = true;
  console.log(facts ? `${head}  ${dim(facts)}` : head.trimEnd());
}

/** What a row found, indented under it. The one thing a reporting task prints
    after its facts, and the reason the gate can pass a child through untouched. */
export function detail(text: string): void {
  spoke = true;
  for (const line of String(text).split('\n')) console.log(REPORTING ? line : `       ${line}`.trimEnd());
}

/** A statement a task makes about itself, for tasks that are not check lists.
    The value is the same column the rows put their facts in. */
export function fact(text: string, value = ''): void {
  if (REPORTING) return;
  spoke = true;
  console.log(value ? `  ${text.padEnd(labelWidth)}  ${dim(value)}` : `  ${text}`);
}

/** Worth reading, not worth failing over. */
export function note(text: string): void {
  if (REPORTING) return;
  spoke = true;
  console.log(`  ${MARK.warn}  ${text}`);
}

/** Something is wrong. Printed wherever the task is, in or out of the gate. */
export function bad(text: string): void {
  spoke = true;
  console.log(`  ${MARK.bad}  ${text}`);
}

/** The verdict, and the last thing a task prints. */
export function close(state: State, message: string): void {
  if (REPORTING) return;
  if (spoke) console.log();
  console.log(`${MARK[state]} ${message}`);
}

/** The contract: the facts the gate puts in its row, then what went wrong.
    Outside the gate the same two things read as a task's own closing lines —
    `shown` for a task that has already printed them under the rows they
    belong to, which must still report them to the gate. */
export function summary(facts: string, problems: readonly string[] = [], { shown = false } = {}): void {
  if (REPORTING) {
    console.log(facts);
    for (const p of problems) detail(p);
    return;
  }
  if (!shown) for (const p of problems) bad(p);
  close(problems.length ? 'bad' : 'ok', facts);
}
