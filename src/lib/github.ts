export type ContributionsData = {
  total: number;
  // 53 weeks × 7 days of levels 0-4; -1 marks a padded cell with no day
  cells: number[];
  months: { column: number; label: string }[];
};

const WEEKS = 53;
const DAYS = WEEKS * 7;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDate(date: string) {
  return new Date(`${date}T00:00:00Z`);
}

export async function getContributions(username: string): Promise<ContributionsData> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Contributions API returned ${res.status}`);

    const data = (await res.json()) as {
      total?: { lastYear?: number };
      contributions?: { date: string; count: number; level: number }[];
    };
    const days = data.contributions ?? [];
    if (days.length === 0) throw new Error("No contribution data");

    // The grid starts on a Sunday; pad the front and back so it is exactly 53 columns
    const lead = parseDate(days[0].date).getUTCDay();
    const cells: number[] = Array.from({ length: lead }, () => -1);
    const dates: (string | null)[] = Array.from({ length: lead }, () => null);
    for (const day of days) {
      cells.push(day.level ?? 0);
      dates.push(day.date);
    }
    while (cells.length % 7 !== 0 || cells.length < DAYS) {
      cells.push(-1);
      dates.push(null);
    }
    if (cells.length > DAYS) {
      cells.splice(0, cells.length - DAYS);
      dates.splice(0, dates.length - DAYS);
    }

    // Label each column by the month of its middle row, on month changes
    const months: { column: number; label: string }[] = [];
    let prevMonth: number | null = null;
    for (let column = 0; column < cells.length / 7; column++) {
      const mid = dates[column * 7 + 3];
      if (!mid) continue;
      const month = parseDate(mid).getUTCMonth();
      if (month !== prevMonth) {
        months.push({ column, label: MONTHS[month] });
        prevMonth = month;
      }
    }

    const total = data.total?.lastYear ?? days.reduce((sum, day) => sum + (day.count ?? 0), 0);
    return { total, cells, months };
  } catch {
    return { total: 0, cells: Array.from({ length: DAYS }, () => -1), months: [] };
  }
}
