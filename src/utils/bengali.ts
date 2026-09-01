// Bengali Language Formatting & Date Utilities

export const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const BENGALI_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

export const BENGALI_DAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

/**
 * Converts any number or numeric string to Bengali numerals (e.g. 350 -> ৩৫০)
 */
export function toBengaliNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '০';
  const str = String(val);
  return str.replace(/[0-9]/g, (w) => BENGALI_DIGITS[parseInt(w, 10)]);
}

/**
 * Converts Bengali numerals back to standard English number
 */
export function fromBengaliNumber(bengaliStr: string): number {
  if (!bengaliStr) return 0;
  let eng = bengaliStr;
  BENGALI_DIGITS.forEach((bDigit, idx) => {
    eng = eng.split(bDigit).join(String(idx));
  });
  const parsed = parseFloat(eng.replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats monetary amounts in Bengali currency notation (e.g. ৳৩৫০)
 */
export function formatBengaliCurrency(amount: number, useBengaliDigits: boolean = true): string {
  const rounded = Math.abs(Math.round(amount));
  const formatted = rounded.toLocaleString('en-US'); // gives commas like 1,250
  if (useBengaliDigits) {
    return `৳${toBengaliNumber(formatted)}`;
  }
  return `৳${formatted}`;
}

/**
 * Formats YYYY-MM-DD date string to rich Bengali date object
 */
export function formatBengaliDate(dateStr: string) {
  try {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(
      tomorrow.getDate()
    ).padStart(2, '0')}`;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
      yesterday.getDate()
    ).padStart(2, '0')}`;

    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);

    const bnDayNum = toBengaliNumber(day);
    const bnMonth = BENGALI_MONTHS[month - 1] || '';
    const bnYear = toBengaliNumber(year);
    const bnDayName = BENGALI_DAYS[d.getDay()] || '';

    const isToday = dateStr === todayStr;
    const isTomorrow = dateStr === tomorrowStr;
    const isYesterday = dateStr === yesterdayStr;

    return {
      full: `${bnDayNum} ${bnMonth}, ${bnYear}`,
      fullBangla: `${bnDayNum} ${bnMonth}, ${bnYear}`,
      day: bnDayName,
      dayBangla: bnDayName,
      monthDay: `${bnDayNum} ${bnMonth}`,
      monthDayBangla: `${bnDayNum} ${bnMonth}`,
      relativeLabel: isToday
        ? 'আজকের বাজার'
        : isTomorrow
        ? 'আগামীকাল (পরিকল্পিত)'
        : isYesterday
        ? 'গতকালকের বাজার'
        : `${bnDayNum} ${bnMonth}`,
      isToday,
      isTomorrow,
      isYesterday,
      dayNumberBangla: bnDayNum,
      monthNameBangla: bnMonth,
    };
  } catch {
    return {
      full: dateStr,
      fullBangla: dateStr,
      day: '',
      dayBangla: '',
      monthDay: dateStr,
      monthDayBangla: dateStr,
      relativeLabel: dateStr,
      isToday: false,
      isTomorrow: false,
      isYesterday: false,
      dayNumberBangla: toBengaliNumber(dateStr),
      monthNameBangla: '',
    };
  }
}

/**
 * Common quick-pick grocery badges in Bengali
 */
export const POPULAR_BENGALI_ITEMS = [
  'মুরগির মাংস',
  'গরুর মাংস',
  'ফার্মের ডিম',
  'রুই মাছ',
  'ইলিশ মাছ',
  'আলু',
  'লাল শাক',
  'পালং শাক',
  'পুঁই শাক',
  'মসুর ডাল',
  'সয়াবিন তেল',
  'পেঁয়াজ-রসুন',
  'কাঁচা মরিচ',
  'টমেটো',
  'বেগুন',
  'চিনিগুঁড়া চাল',
];

/**
 * Common quick-pick cooked dishes in Bengali
 */
export const POPULAR_BENGALI_MENUS = [
  'ঝাল মুরগির মাংসের ঝোল, লাল শাক ও ডাল',
  'ডিম ভুনা, আলু ভর্তা ও পাতলা ডাল',
  'রুই মাছের ঝোল, বেগুন ভর্তা ও ভাত',
  'স্পেশাল গরুর মাংস ভুনা ও সালাদ',
  'ডিম কোরমা ও ডাল চচ্চড়ি',
  'ভুনা খিচুড়ি ও ডিম ভাজা',
  'মাছের মাথা দিয়ে মুগ ডাল ও ভাত',
];
