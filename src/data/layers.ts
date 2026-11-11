export type Group = "great" | "small" | "arc";
export type Status = "computed" | "review" | "schematic";

export interface LayerDef {
  id: string; num: number; file: string; group: Group;
  ar: string; en: string; ml: string; def: string; color: string; status: Status;
}

export const GROUPS: Record<Group, { ar: string; en: string; ml: string }> = {
  great: { ar: "الدَّوَائِرُ الْعِظَامُ", en: "Great circles", ml: "മഹാവൃത്തങ്ങൾ" },
  small: { ar: "الدَّوَائِرُ الصِّغَارُ", en: "Small circles", ml: "ലഘുവൃത്തങ്ങൾ" },
  arc: { ar: "الْقِسِيُّ الْمَشْهُورَةُ", en: "Angular arcs", ml: "പ്രസിദ്ധ ചാപങ്ങൾ" },
};

const L = (num: number, file: string, group: Group, ar: string, en: string, ml: string, def: string, color: string, status: Status = "computed"): LayerDef =>
  ({ id: file.replace(".png", ""), num, file, group, ar, en, ml, def, color, status });

export const LAYERS: LayerDef[] = [
  L(1, "01_equator.png", "great", "مُعَدِّلُ النَّهَارِ", "Celestial equator", "ഖഗോള ധ്രുവങ്ങളിൽ നിന്ന് തുല്യ അകലത്തിലുള്ള മഹാവൃത്തം; ഭൂമധ്യരേഖയുടെ ആകാശ പ്രതിരൂപം.", "Great circle whose plane is perpendicular to the celestial pole axis (δ = 0°).", "#f5c542"),
  L(2, "02_ecliptic.png", "great", "مِنْطَقَةُ الْبُرُوجِ", "Ecliptic", "സൂര്യന്റെ വാർഷിക ദൃശ്യപഥം; മുഅദ്ദിലുന്നഹാറിനോട് ഏകദേശം 23.44° ചരിഞ്ഞിരിക്കുന്നു.", "Annual apparent path of the Sun, inclined to the equator by the obliquity ε of the epoch.", "#ff5d5d"),
  L(3, "03_four_poles.png", "great", "الدَّائِرَةُ الْمَارَّةُ بِالْأَقْطَابِ الْأَرْبَعَةِ", "Solstitial colure (circle through four poles)", "ഖഗോള ധ്രുവങ്ങളും ക്രാന്തിവൃത്ത ധ്രുവങ്ങളും — നാലു ധ്രുവങ്ങളിലൂടെയും കടന്നുപോകുന്ന മഹാവൃത്തം.", "Great circle through both celestial poles and both ecliptic poles; passes through the solstices.", "#c084fc"),
  L(4, "04_declination.png", "great", "دَائِرَةُ الْمَيْلِ", "Declination (hour) circle", "ഖഗോള ധ്രുവങ്ങളിലൂടെയും തിരഞ്ഞെടുത്ത നക്ഷത്രത്തിലൂടെയും കടന്നുപോകുന്ന മഹാവൃത്തം.", "Great circle through the celestial poles and the selected target (Aldebaran).", "#38bdf8"),
  L(5, "05_latitude.png", "great", "دَائِرَةُ الْعَرْضِ", "Circle of ecliptic latitude", "ക്രാന്തിവൃത്ത ധ്രുവങ്ങളിലൂടെയും നക്ഷത്രത്തിലൂടെയും കടന്നുപോകുന്ന മഹാവൃത്തം.", "Great circle through the ecliptic poles and the selected target.", "#fb923c"),
  L(6, "06_horizon.png", "great", "دَائِرَةُ الْأُفُقِ", "Horizon", "നിരീക്ഷകന്റെ ദൃശ്യ-അദൃശ്യ അർധഗോളങ്ങളെ വേർതിരിക്കുന്ന മഹാവൃത്തം (Y = 0).", "Great circle Y = 0, perpendicular to the zenith–nadir line.", "#4ade80"),
  L(7, "07_meridian.png", "great", "دَائِرَةُ نِصْفِ النَّهَارِ", "Meridian", "വടക്ക്–ഉച്ചി–തെക്ക്–അധോബിന്ദു വഴി കടന്നുപോകുന്ന മഹാവൃത്തം.", "Great circle through N, zenith, S and nadir (plane X = 0).", "#e879f9"),
  L(8, "08_first_vertical.png", "great", "دَائِرَةُ أَوَّلِ السُّمُوتِ", "Prime vertical", "കിഴക്ക്–ഉച്ചി–പടിഞ്ഞാറ്–അധോബിന്ദു വഴിയുള്ള മഹാവൃത്തം.", "Great circle through E, zenith, W and nadir (plane Z = 0).", "#2dd4bf"),
  L(9, "09_mid_sky.png", "great", "دَائِرَةُ وَسَطِ سَمَاءِ الرُّؤْيَةِ", "Circle of mid-sky of vision", "ചരിത്രപരമായ നിർവചനം മൂലഗ്രന്ഥവുമായി ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Historical definition under scholarly review — not constructed.", "#a3a3a3", "review"),
  L(10, "10_altitude.png", "great", "دَائِرَةُ الِارْتِفَاعِ", "Vertical (altitude) circle", "ഉച്ചിയിലൂടെയും അധോബിന്ദുവിലൂടെയും നക്ഷത്രത്തിലൂടെയും കടന്നുപോകുന്ന മഹാവൃത്തം.", "Great circle through zenith, nadir and the target.", "#facc15"),
  L(11, "11_daily_circles.png", "small", "الْمَدَارَاتُ الْيَوْمِيَّةُ", "Diurnal circles", "മുഅദ്ദിലുന്നഹാറിന് സമാന്തരമായ ചെറുവൃത്തങ്ങൾ; നക്ഷത്രങ്ങൾ ദിവസേന ഇവയിലൂടെ ചുറ്റുന്നു.", "Small circles parallel to the equator (δ = ±20°, ±45°, and the target's own).", "#fde68a"),
  L(12, "12_latitude_circles.png", "small", "مَدَارَاتُ الْعَرْضِ", "Parallels of ecliptic latitude", "ക്രാന്തിവൃത്തത്തിന് സമാന്തരമായ ചെറുവൃത്തങ്ങൾ.", "Small circles parallel to the ecliptic (β = ±15°, ±40°).", "#fca5a5"),
  L(13, "13_almucantars.png", "small", "الْمُقَنْطَرَاتُ", "Almucantars", "ചക്രവാളത്തിന് സമാന്തരമായ തുല്യ ഉയരമുള്ള വൃത്തങ്ങൾ (15°, 30°, 45°, 60°).", "Circles of equal altitude parallel to the horizon.", "#86efac"),
  L(14, "14_obliquity.png", "arc", "الْمَيْلُ الْكُلِّيُّ", "Obliquity of the ecliptic", "മുഅദ്ദിലുന്നഹാറും ക്രാന്തിവൃത്തവും തമ്മിലുള്ള പരമാവധി അകലം (≈23.44°).", "Arc at the summer solstice between equator and ecliptic, equal to ε.", "#f97316"),
  L(15, "15_first_declination.png", "arc", "الْمَيْلُ الْأَوَّلُ", "First declination", "ക്രാന്തിവൃത്ത ബിന്ദുവിൽ (സൂര്യൻ) നിന്ന് മൈൽ വൃത്തത്തിലൂടെ മുഅദ്ദിലിലേക്കുള്ള ചാപം. നിർവചനം ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Arc of the declination circle from the ecliptic point (Sun) to the equator. Common reading; cross-check with primary text.", "#22d3ee"),
  L(16, "16_second_declination.png", "arc", "الْمَيْلُ الثَّانِي", "Second declination", "ക്രാന്തിവൃത്ത ബിന്ദുവിൽ നിന്ന് അർദ് വൃത്തത്തിലൂടെ മുഅദ്ദിലിലേക്കുള്ള ചാപം. നിർവചനം ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Arc of the ecliptic-latitude circle from the ecliptic point (Sun) to the equator. Common reading; cross-check with primary text.", "#818cf8"),
  L(17, "17_star_declination.png", "arc", "بُعْدُ الْكَوْكَبِ", "Declination of the star", "നക്ഷത്രത്തിൽ നിന്ന് മുഅദ്ദിലുന്നഹാറിലേക്കുള്ള അകലം.", "Arc of the declination circle from the target to the equator.", "#0ea5e9"),
  L(18, "18_star_latitude.png", "arc", "عَرْضُ الْكَوْكَبِ", "Ecliptic latitude of the star", "നക്ഷത്രത്തിൽ നിന്ന് ക്രാന്തിവൃത്തത്തിലേക്കുള്ള അകലം.", "Arc of the latitude circle from the target to the ecliptic.", "#f59e0b"),
  L(19, "19_geographic_latitude.png", "arc", "عَرْضُ الْبَلَدِ", "Geographic latitude", "ഉച്ചിയിൽ നിന്ന് മുഅദ്ദിലിലേക്കുള്ള ചാപം = ധ്രുവത്തിന്റെ ഉയരം = അക്ഷാംശം.", "Arc on the meridian from zenith to the equator; equal to the pole's altitude φ.", "#a78bfa"),
  L(20, "20_geographic_longitude.png", "arc", "طُولُ الْبَلَدِ", "Geographic longitude", "ഭൂമിയിലെ രേഖാംശം; ചരിത്രപരമായ ആരംഭ മെറിഡിയൻ ഗ്രീനിച്ചിൽ നിന്ന് വ്യത്യസ്തമാകാം.", "Shown as the hour-angle offset between the local meridian and the Greenwich meridian on the equator. Historical prime meridians differed.", "#94a3b8", "schematic"),
  L(21, "21_rising_amplitude.png", "arc", "سَعَةُ الْمَشْرِقِ", "Rising amplitude", "കിഴക്ക് ബിന്ദുവിൽ നിന്ന് സൂര്യോദയ ബിന്ദുവിലേക്കുള്ള ചക്രവാള ചാപം.", "Horizon arc from the East point to the Sun's rising point.", "#fbbf24"),
  L(22, "22_setting_amplitude.png", "arc", "سَعَةُ الْمَغْرِبِ", "Setting amplitude", "പടിഞ്ഞാറ് ബിന്ദുവിൽ നിന്ന് അസ്തമയ ബിന്ദുവിലേക്കുള്ള ചക്രവാള ചാപം.", "Horizon arc from the West point to the Sun's setting point.", "#f472b6"),
  L(23, "23_altitude_arc.png", "arc", "قَوْسُ الِارْتِفَاعِ", "Altitude arc", "ചക്രവാളത്തിന് മുകളിൽ സൂര്യന്റെ ഉയരം (സൂര്യൻ ഉദിച്ചിരിക്കുമ്പോൾ).", "Vertical-circle arc from the horizon up to the Sun when above the horizon.", "#fde047"),
  L(24, "24_depression_arc.png", "arc", "قَوْسُ الِانْحِطَاطِ", "Depression arc", "ചക്രവാളത്തിന് താഴെ സൂര്യന്റെ താഴ്ച (രാത്രിയിൽ).", "Vertical-circle arc from the horizon down to the Sun when below the horizon.", "#60a5fa"),
  L(25, "25_azimuth_arc.png", "arc", "قَوْسُ السَّمْتِ", "Azimuth arc (traditional)", "കിഴക്ക്/പടിഞ്ഞാറ് ബിന്ദുവിൽ നിന്ന് സൂര്യന്റെ ഉയരവൃത്തം വരെയുള്ള ചക്രവാള ചാപം (പരമ്പരാഗത രീതി).", "Horizon arc from the nearer E/W point to the foot of the Sun's vertical circle. Modern azimuth is measured clockwise from North.", "#34d399"),
  L(26, "26_day_arc.png", "arc", "قَوْسُ النَّهَارِ", "Day arc", "സൂര്യന്റെ ദിനവൃത്തത്തിൽ ചക്രവാളത്തിന് മുകളിലുള്ള ഭാഗം.", "Above-horizon portion of the Sun's diurnal circle.", "#fef08a"),
  L(27, "27_night_arc.png", "arc", "قَوْسُ اللَّيْلِ", "Night arc", "സൂര്യന്റെ ദിനവൃത്തത്തിൽ ചക്രവാളത്തിന് താഴെയുള്ള ഭാഗം.", "Below-horizon portion of the Sun's diurnal circle.", "#6366f1"),
  L(28, "28_day_correction.png", "arc", "تَعْدِيلُ النَّهَارِ", "Equation of daylight", "ചരിത്രപരമായ നിർവചനം മൂലഗ്രന്ഥവുമായി ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Historical definition under scholarly review — not constructed.", "#a3a3a3", "review"),
  L(29, "29_diurnal_arc.png", "arc", "الدَّائِرُ", "Al-dāʾir (elapsed arc)", "ചരിത്രപരമായ നിർവചനം മൂലഗ്രന്ഥവുമായി ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Historical definition under scholarly review — not constructed.", "#a3a3a3", "review"),
  L(30, "30_visible_sky_latitude.png", "arc", "عَرْضُ إِقْلِيمِ الرُّؤْيَةِ", "Latitude of the clime of vision", "ചരിത്രപരമായ നിർവചനം മൂലഗ്രന്ഥവുമായി ഒത്തുനോക്കേണ്ടതുണ്ട്.", "Historical definition under scholarly review — not constructed.", "#a3a3a3", "review"),
];

export const LAYER_BY_ID = Object.fromEntries(LAYERS.map((l) => [l.id, l]));

const ids = (...n: number[]) => LAYERS.filter((l) => n.includes(l.num)).map((l) => l.id);
export const PRESETS: Record<string, string[] | null> = {
  ALL: LAYERS.map((l) => l.id),
  "Core geometry": ids(1, 2, 6, 7, 8),
  "Sun on Ecliptic": ids(1, 2, 21, 22, 26, 27),
  "Observer/Horizon": ids(6, 7, 8, 10, 13, 23, 25),
  Arcs: LAYERS.filter((l) => l.group === "arc").map((l) => l.id),
  Stars: ids(1, 2, 4, 5, 11, 17, 18),
  Custom: null,
};
