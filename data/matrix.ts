/* ------------------------------------------------------------------
   Matrix Directory Database — 192 registry cards
   Structure mirrors the original portal: company cards with flip
   backs, group rosters + members, corporate divisions and soloists.
------------------------------------------------------------------- */

export type Cat =
  | "Big 4 Ecosystem"
  | "Conglomerate Subsidiary"
  | "Independent Label"
  | "Boutique Independent"
  | "Units"
  | "Extended Registry & Legacy"
  | "Soloists & Independent Artists"
  | "Actor & Model Agencies";

export interface Group {
  n: string;
  m: string;
}

export interface Company {
  name: string;
  cat: Cat;
  desc: string;
  logo?: "hybe" | "sm" | "jyp" | "yg" | "pledis" | "starship" | "cube" | "ador";
  groups?: Group[];
  note?: string;
  kind?: "corp" | "solo";
}

const E = (
  name: string,
  cat: Cat,
  desc: string,
  extra: Partial<Company> = {}
): Company => ({ name, cat, desc, ...extra });

export const matrix: Company[] = [
  /* ---------- BIG 4 ECOSYSTEM (24) ---------- */
  E("Big Hit Music", "Big 4 Ecosystem", "HYBE flagship pillar managing global icons.", { logo: "hybe", groups: [
    { n: "BTS", m: "RM, Jin, SUGA, j-hope, Jimin, V, Jung Kook." },
    { n: "TOMORROW X TOGETHER", m: "Soobin, Yeonjun, Beomgyu, Taehyun, Hueningkai." } ] }),
  E("Pledis Entertainment", "Big 4 Ecosystem", "Major HYBE label of performance forces & rookies.", { logo: "pledis", groups: [
    { n: "SEVENTEEN", m: "S.Coups, Jeonghan, Joshua, Jun, Hoshi, Wonwoo, Woozi, DK, Mingyu, The8, Seungkwan, Vernon, Dino." },
    { n: "SEVENTEEN Sub-Units", m: "Hip-Hop Unit (S.Coups, Wonwoo, Mingyu, Vernon) · Vocal Unit (Jeonghan, Joshua, Woozi, DK, Seungkwan) · Performance Unit (Hoshi, Jun, The8, Dino)." },
    { n: "fromis_9", m: "Saerom, Hayoung, Jiwon, Jisun, Seoyeon, Chaeyoung, Nagyung, Jiheon." },
    { n: "TWS", m: "Shinyu, Dohoon, Youngjae, Hanjin, Jihoon, Kyungmin." } ] }),
  E("Belift Lab", "Big 4 Ecosystem", "HYBE house born from global audition systems.", { logo: "hybe", groups: [
    { n: "ENHYPEN", m: "Jungwon, Heeseung, Jay, Jake, Sunghoon, Sunoo, Ni-ki." },
    { n: "ILLIT", m: "Yunah, Minju, Moka, Wonhee, Iroha." } ] }),
  E("Source Music", "Big 4 Ecosystem", "HYBE girl-group development arm.", { logo: "hybe", groups: [
    { n: "LE SSERAFIM", m: "Sakura, Kim Chaewon, Huh Yunjin, Kazuha, Hong Eunchae." } ] }),
  E("ADOR", "Big 4 Ecosystem", "Boutique global pop concept agency under HYBE.", { logo: "ador", groups: [
    { n: "NewJeans", m: "Minji, Hanni, Danielle, Haerin, Hyein." } ] }),
  E("KOZ Entertainment", "Big 4 Ecosystem", "Hip-hop & pop HYBE subsidiary founded by Zico.", { logo: "hybe", groups: [
    { n: "BOYNEXTDOOR", m: "Sungho, Riwoo, Jaehyun, Taesan, Leehan, Woonhak." },
    { n: "Zico", m: "Solo artist / producer & label founder." } ] }),
  E("HYBE Labels Japan", "Big 4 Ecosystem", "Tokyo-localized HYBE performance infrastructure.", { logo: "hybe", groups: [
    { n: "&TEAM", m: "K, Fuma, Nicholas, EJ, Yuma, Jo, Harua, Taki, Maki." } ] }),
  E("NAECO", "Big 4 Ecosystem", "HYBE Japan boutique subsidiary for domestic Japanese solo actor-artist profiles & localized projects.", { logo: "hybe", kind: "corp",
    note: "Japanese solo artist & actor management arm (HYBE Japan network). No idol group roster." }),
  E("SM Entertainment", "Big 4 Ecosystem", "Legendary powerhouse & creator of modern idol blueprints.", { logo: "sm", groups: [
    { n: "aespa", m: "Karina, Giselle, Winter, Ningning." },
    { n: "RIIZE", m: "Shotaro, Eunseok, Sungchan, Wonbin, Sohee, Anton." },
    { n: "Red Velvet", m: "Irene, Seulgi, Wendy, Joy, Yeri." },
    { n: "NCT 127", m: "Johnny, Taeyong, Yuta, Doyoung, Jaehyun, Jungwoo, Mark, Haechan." },
    { n: "NCT DREAM", m: "Mark, Renjun, Jeno, Haechan, Jaemin, Chenle, Jisung." },
    { n: "NCT WISH", m: "Sion, Riku, Yushi, Jaehee, Ryo, Sakuya." } ] }),
  E("Mystic Story", "Big 4 Ecosystem", "SM creative division for alt-pop, ballad & actors.", { logo: "sm", groups: [
    { n: "Billlie", m: "Moon Sua, Suhyeon, Haram, Tsuki, Sheon, Siyoon, Haruna." },
    { n: "BIG Naughty", m: "Solo rapper (Seo Dong-hyun)." },
    { n: "Yoon Jong-shin", m: "Veteran singer-songwriter." } ] }),
  E("ScreaM Records", "Big 4 Ecosystem", "SM electronic dance music division.", { logo: "sm", groups: [
    { n: "Raiden", m: "DJ / producer." },
    { n: "IMLAY", m: "DJ / producer." },
    { n: "GINJO", m: "DJ / producer." } ] }),
  E("KRUCIALIZE", "Big 4 Ecosystem", "Contemporary R&B / hip-hop label in the SM pipeline.", { logo: "sm", groups: [
    { n: "Crush", m: "R&B soloist (Shin Hyo-seob)." } ] }),
  E("Label SJ", "Big 4 Ecosystem", "Dedicated SM unit for veteran legends.", { logo: "sm", groups: [
    { n: "Super Junior", m: "Leeteuk, Heechul, Yesung, Shindong, Sungmin, Eunhyuk, Donghae, Siwon, Ryeowook, Kyuhyun." } ] }),
  E("Label V", "Big 4 Ecosystem", "SM branch for the China-market unit.", { logo: "sm", groups: [
    { n: "WayV", m: "Kun, Ten, WinWin, Xiaojun, Hendery, YangYang." } ] }),
  E("YG Entertainment", "Big 4 Ecosystem", "Iconic powerhouse of Korea's global hip-hop influence.", { logo: "yg", groups: [
    { n: "BLACKPINK", m: "Jisoo, Jennie, Rosé, Lisa." },
    { n: "TREASURE", m: "Hyunsuk, Jihoon, Yoshi, Junkyu, Jaehyuk, Asahi, Doyoung, Haruto, Jeongwoo, Junghwan." },
    { n: "BABYMONSTER", m: "Ruka, Pharita, Asa, Ahyeon, Rami, Rora, Chiquita." } ] }),
  E("The Black Label", "Big 4 Ecosystem", "YG partner & production powerhouse led by Teddy.", { logo: "yg", groups: [
    { n: "MEOVV", m: "Sooin, Anna, Gawon, Narin, Ella." },
    { n: "Taeyang", m: "Soloist (ex-BIGBANG)." },
    { n: "Jeon Somi", m: "Soloist." },
    { n: "Zion.T", m: "R&B soloist." },
    { n: "Rosé", m: "Soloist (of BLACKPINK)." } ] }),
  E("YG Plus", "Big 4 Ecosystem", "YG corporate distribution, merch & platform network.", { logo: "yg", kind: "corp",
    note: "Distribution, merchandise curation & global physical media division. No idol roster." }),
  E("JYP Division 1", "Big 4 Ecosystem", "JYP pipeline for global touring leaders.", { logo: "jyp", groups: [
    { n: "Stray Kids", m: "Bang Chan, Lee Know, Changbin, Hyunjin, Han, Felix, Seungmin, I.N." },
    { n: "2PM", m: "Jun.K, Nichkhun, Taecyeon, Wooyoung, Junho, Chansung." } ] }),
  E("JYP Division 2", "Big 4 Ecosystem", "JYP task-force for global charting lines.", { logo: "jyp", groups: [
    { n: "ITZY", m: "Yeji, Lia, Ryujin, Chaeryeong, Yuna." },
    { n: "NEXZ", m: "Yu, Hyui, Sho, Haru, Yuki, Tomoya, Seita." } ] }),
  E("JYP Division 3", "Big 4 Ecosystem", "JYP division for next-gen girl-group lines.", { logo: "jyp", groups: [
    { n: "NMIXX", m: "Lily, Haewon, Sullyoon, Bae, Jiwoo, Kyujin." } ] }),
  E("JYP Division 4", "Big 4 Ecosystem", "JYP band-focused division.", { logo: "jyp", groups: [
    { n: "DAY6", m: "Sungjin, Young K, Wonpil, Dowoon." } ] }),
  E("JYP SQU4D", "Big 4 Ecosystem", "JYP global project division.", { logo: "jyp", groups: [
    { n: "VCHA", m: "KG, Camila, Kaylee, Lexi, Savanna." } ] }),
  E("Studio J", "Big 4 Ecosystem", "JYP sub-label for band & alternative acts.", { logo: "jyp", groups: [
    { n: "Xdinary Heroes", m: "Gunil, Jungsu, Gaon, O.de, Jun Han, Jooyeon." } ] }),
  E("Innit Entertainment", "Big 4 Ecosystem", "JYP-affiliated boutique creative label for new artist development & incubation.", { logo: "jyp", kind: "corp",
    note: "Rookie artist development & incubation (JYP network)." }),

  /* ---------- CONGLOMERATE SUBSIDIARY (8) ---------- */
  E("Starship Entertainment", "Conglomerate Subsidiary", "Kakao-affiliated giant of chart-topping groups.", { logo: "starship", groups: [
    { n: "MONSTA X", m: "Shownu, Minhyuk, Kihyun, Hyungwon, Joohoney, I.M." },
    { n: "IVE", m: "Yujin, Gaeul, Rei, Wonyoung, Liz, Leeseo." },
    { n: "CRAVITY", m: "Serim, Allen, Jungmo, Woobin, Wonjin, Minhee, Hyeongjun, Taeyoung, Seongmin." } ] }),
  E("Cre.ker Entertainment", "Conglomerate Subsidiary", "Kakao performance label behind 4th-gen boy power.", { groups: [
    { n: "THE BOYZ", m: "Sangyeon, Jacob, Younghoon, Hyunjae, Juyeon, Kevin, New, Q, Ju Haknyeon, Sunwoo, Eric." } ] }),
  E("WAKEONE", "Conglomerate Subsidiary", "CJ ENM global project-label powerhouse.", { groups: [
    { n: "ZEROBASEONE", m: "Sung Hanbin, Kim Jiwoong, Zhang Hao, Seok Matthew, Kim Taerae, Ricky, Kim Gyuvin, Park Gunwook, Han Yujin." },
    { n: "Kep1er", m: "Yujin, Xiaoting, Mashiro, Chaehyun, Dayeon, Hikaru, Huening Bahiyyih, Youngeun, Yeseo." },
    { n: "izna", m: "Mai, Jeemin, Jiyoon, Koko, Sarang, Jungeun, Saebi." } ] }),
  E("Stone Music Entertainment", "Conglomerate Subsidiary", "CJ ENM distribution & production backbone.", { kind: "corp",
    note: "Digital distribution, production & OST pipeline (CJ ENM network)." }),
  E("JYP Entertainment Japan", "Conglomerate Subsidiary", "JYP × Sony Music joint pipeline for Japan-first groups.", { logo: "jyp", groups: [
    { n: "NiziU", m: "Mako, Rio, Maya, Riku, Ayaka, Mayuka, Rima, Miihi, Nina." } ] }),
  E("IST Entertainment", "Conglomerate Subsidiary", "Kakao-distributed label line of Apink lineage.", { groups: [
    { n: "Weeekly", m: "Soojin, Monday, Soeun, Jaehee, Jihan, Zoa." },
    { n: "ATBO", m: "Junseok, Junmin, Hyunjun, Rakwon, Seunghwan, Yeonkyu, Won Bin." } ] }),
  E("EDAM Entertainment", "Conglomerate Subsidiary", "Kakao label managing the nation's sweetheart soloist.", { groups: [
    { n: "IU", m: "Solo singer-songwriter & actress (Lee Ji-eun)." } ] }),
  E("High Up Entertainment", "Conglomerate Subsidiary", "Kakao project label crafting teen-fresh hits.", { groups: [
    { n: "STAYC", m: "Sumin, Sieun, Isa, Seeun, Yoon, J." } ] }),

  /* ---------- INDEPENDENT LABEL (42) ---------- */
  E("Cube Entertainment", "Independent Label", "Veteran hit-maker of self-producing idol groups.", { logo: "cube", groups: [
    { n: "(G)I-DLE", m: "Miyeon, Minnie, Soyeon, Yuqi, Shuhua." },
    { n: "BTOB", m: "Eunkwang, Minhyuk, Changsub, Hyunsik, Peniel, Sungjae." },
    { n: "PENTAGON", m: "Jinho, Hui, Hongseok, Shinwon, Yeo One, Yanan, Yuto, Kino, Wooseok." },
    { n: "LIGHTSUM", m: "Sangah, Chowon, Nayoung, Hina, Juhyeon, Yujeong." } ] }),
  E("RBW", "Independent Label", "Vocal-first label of MAMAMOO lineage.", { groups: [
    { n: "MAMAMOO", m: "Solar, Moonbyul, Wheein, Hwasa." },
    { n: "ONEUS", m: "Seoho, Leedo, Keonhee, Hwanwoong, Xion." },
    { n: "ONEWE", m: "Yonghoon, Kanghyun, Harin, Dongmyeong, Giuk." },
    { n: "PURPLE KISS", m: "Goeun, Dosie, Ireh, Yuki, Chaein, Swan." } ] }),
  E("DSP Media", "Independent Label", "Pioneer label of KARA & Sechs Kies-era pop history.", { groups: [
    { n: "KARD", m: "BM, J.Seph, Somin, Jiwoo." },
    { n: "MIRAE", m: "Lien, Junhyuk, Douhyun, Khael, Dongpyo, Siyoung, Yubin." } ] }),
  E("FNC Entertainment", "Independent Label", "Band-rooted powerhouse turned idol multi-roster house.", { groups: [
    { n: "CNBLUE", m: "Yonghwa, Minhyuk, Jungshin." },
    { n: "SF9", m: "Youngbin, Inseong, Jaeyoon, Dawon, Zuho, Taeyang, Hwiyoung, Chani." },
    { n: "P1Harmony", m: "Keeho, Theo, Jiung, Intak, Soul, Jongseob." },
    { n: "AMPERS&ONE", m: "7-member multinational boy group (2023 debut)." } ] }),
  E("KQ Entertainment", "Independent Label", "Performance-driven house of ATEEZ.", { groups: [
    { n: "ATEEZ", m: "Hongjoong, Seonghwa, Yunho, Yeosang, San, Mingi, Wooyoung, Jongho." },
    { n: "xikers", m: "Minjae, Junmin, Sumin, Jinsik, Hyunwoo, Junghoon, Seeun, Yujun, Hunter, Yechan." } ] }),
  E("P Nation", "Independent Label", "Psy's artist-first label of bold solo colors.", { groups: [
    { n: "PSY", m: "Founder / global soloist." },
    { n: "Hwasa", m: "Soloist (of MAMAMOO)." },
    { n: "TNX", m: "Kyungjun, Taehun, Hyunsoo, Junhyeok, Hwi, Sungjun." } ] }),
  E("AOMG", "Independent Label", "Above Ordinary hip-hop collective label.", { groups: [
    { n: "Loco", m: "Rapper (Kwon Hyuk-woo)." },
    { n: "Gray", m: "Producer / soloist." },
    { n: "Code Kunst", m: "Producer." } ] }),
  E("H1GHR MUSIC", "Independent Label", "Jay Park-founded global hip-hop house.", { groups: [
    { n: "pH-1", m: "Rapper (Harry Park)." },
    { n: "GroovyRoom", m: "Producer duo (Lil Moshpit)." } ] }),
  E("MORE VISION", "Independent Label", "Jay Park's next-era performance label.", { groups: [
    { n: "Jay Park", m: "Founder / soloist." },
    { n: "HolyBang", m: "Champion dance crew (Street Dance Girls Fighter)." } ] }),
  E("C9 Entertainment", "Independent Label", "Mid-size label stacking 4th-gen boy rosters.", { groups: [
    { n: "CIX", m: "BX, Seunghun, Yonghee, Bae Jinyoung, Hyunsuk." },
    { n: "EPEX", m: "Wish, Keum, Mu, A-Min, Baekseung, Ayden, Yewang, Jeff." } ] }),
  E("Fantagio", "Independent Label", "Actor-idol hybrid house of ASTRO fame.", { groups: [
    { n: "ASTRO", m: "MJ, JinJin, Cha Eun-woo, Yoon San-ha. (In loving memory of Moonbin.)" },
    { n: "Weki Meki", m: "Suyeon, Elly, Yoojung, Doyeon, Sei, Lua, Rina, Lucy." },
    { n: "LUN8", m: "Chael, Jinsu, Takuma, Junwoo, Dohyun, Ian, Ji Eun-ho, Eunseop." } ] }),
  E("Jellyfish Entertainment", "Independent Label", "Label born from VIXX's concept artistry.", { groups: [
    { n: "VERIVERY", m: "Dongheon, Hoyoung, Minchan, Gyehyeon, Yeonho, Yongseung, Kangmin." },
    { n: "EVNNE", m: "Keita, Hanbin, Jeonghyeon, Seungeon, Yunseo, Junghyun, Jihoo." } ] }),
  E("WM Entertainment", "Independent Label", "B1A4-born label of melodic pop lines.", { groups: [
    { n: "OH MY GIRL", m: "Hyojung, Mimi, YooA, Seunghee, Yubin, Arin." },
    { n: "ONF", m: "Hyojin, E-Tion, J-Us, Wyatt, MK, U." },
    { n: "B1A4", m: "Sandeul, CNU, Gongchan." } ] }),
  E("Woollim Entertainment", "Independent Label", "INFINITE-lineage label under SM C&C wing.", { groups: [
    { n: "DRIPPIN", m: "Yunseong, Hyeop, Changuk, Dongyun, Minseo, Junho, Alex." },
    { n: "Rocket Punch", m: "Yeonhee, Juri, Suyun, Yunkyoung, Sohee, Dahyun." } ] }),
  E("TOP Media", "Independent Label", "UP10TION-lineage idol house.", { groups: [
    { n: "UP10TION", m: "Kuhn, Kogyeol, Bit-to, Sunyoul, Gyujin, Hwanhee, Xiao." },
    { n: "ODD YOUTH", m: "5-member girl group (2024 debut)." } ] }),
  E("Brave Entertainment", "Independent Label", "Brave Brothers' production-first idol house.", { groups: [
    { n: "DKB", m: "E-Chan, D1, GK, Heechan, Lune, Junseo, Yuku, Harry-June." } ] }),
  E("8D Entertainment", "Independent Label", "Minimal label behind OnlyOneOf.", { groups: [
    { n: "OnlyOneOf", m: "KB, Rie, Yoojung, Junji, Mill, Nine." } ] }),
  E("OUI Entertainment", "Independent Label", "Post-Produce boy-group specialist.", { groups: [
    { n: "WEi", m: "Daehyeon, Donghan, Yongha, Yohan, Seokhwa, Junseo." } ] }),
  E("Brand New Music", "Independent Label", "Hip-hop-rooted idol incubator.", { groups: [
    { n: "AB6IX", m: "Woong, Donghyun, Woojin, Daehwi." },
    { n: "YOUNITE", m: "Eunho, Steve, Hyunseung, Eunsang, Hyungseok, Woono, DEY, Kyungmun, Sion." } ] }),
  E("Around US", "Independent Label", "Founded by HIGHLIGHT themselves.", { groups: [
    { n: "HIGHLIGHT", m: "Yoon Dujun, Yang Yoseob, Lee Gikwang, Son Dongwoon." } ] }),
  E("INB100", "Independent Label", "Baekhyun-founded powerhouse for EXO lines.", { groups: [
    { n: "BAEKHYUN", m: "Soloist (of EXO)." },
    { n: "EXO-CBX", m: "Xiumin, Baekhyun, Chen." } ] }),
  E("ATRP", "Independent Label", "Boutique founded for solo star Chuu.", { groups: [
    { n: "CHUU", m: "Soloist (Kim Ji-woo, former LOONA)." } ] }),
  E("ModHaus", "Independent Label", "Next-gen home of massive rotating group systems.", { groups: [
    { n: "tripleS", m: "24-member rotational girl group system." },
    { n: "ARTMS", m: "Heejin, Haseul, Kim Lip, Jinsoul, Choerry." } ] }),
  E("BPM Entertainment", "Independent Label", "VIVIZ & next-gen performance house.", { groups: [
    { n: "VIVIZ", m: "Eunha, SinB, Umji." },
    { n: "BADVILLAIN", m: "Emma, Chloe Young, Huee, Ina, Yunseo, Vin, Kelly." } ] }),
  E("ATTRAKT", "Independent Label", "Cupid-hit label rebuilt around FIFTY FIFTY 2.0.", { groups: [
    { n: "FIFTY FIFTY", m: "Keena, Chanelle Moon, Yewon, Hana, Athena." } ] }),
  E("143 Entertainment", "Independent Label", "Home of iKON's second chapter.", { groups: [
    { n: "iKON", m: "Jay, Song, Bobby, DK, Ju-ne, Chan." },
    { n: "MADEIN", m: "Mashiro, MiU, Suhye, Yeseo, Serina, Nagomi." } ] }),
  E("KONNECT Entertainment", "Independent Label", "Kang Daniel's independent imprint.", { groups: [
    { n: "KANG DANIEL", m: "Soloist (former Wanna One center)." } ] }),
  E("S2 Entertainment", "Independent Label", "Home of KISS OF LIFE.", { groups: [
    { n: "KISS OF LIFE", m: "Julie, Natty, Belle, Haneul." } ] }),
  E("Yuehua Entertainment Korea", "Independent Label", "China-Korea bridge label.", { groups: [
    { n: "TEMPEST", m: "Hanbin, Hyeongseop, Hyuk, LEW, Eunchan, Hwarang, Taerae." },
    { n: "CHOI YENA", m: "Soloist (former IZ*ONE)." } ] }),
  E("PocketDol Studio", "Independent Label", "MBK-descended idol factory.", { groups: [
    { n: "BAE173", m: "Hangyul, Junseo, Yoojun, Muzin, J-Min, Youngseo, Doha, Bit, Dohyon." },
    { n: "FANTASY BOYS", m: "Multinational boy group (2023 debut)." } ] }),
  E("Dreamcatcher Company", "Independent Label", "Rock-idol pioneers.", { groups: [
    { n: "Dreamcatcher", m: "JiU, SuA, Siyeon, Handong, Yoohyeon, Dami, Gahyeon." } ] }),
  E("FirstOne Entertainment", "Independent Label", "Rookie-focused indie house.", { groups: [
    { n: "NINE.i", m: "Jewon, Eden, Winnie, Minjun, Vahn, Vari, Seowon, Taehun, Joohyoung, Jiho." } ] }),
  E("MLD Entertainment", "Independent Label", "MOMOLAND's home label.", { groups: [
    { n: "MOMOLAND", m: "Hyebin, Jane, Nayun, JooE, Ahin, Nancy." } ] }),
  E("GLG Entertainment", "Independent Label", "Home of H1-KEY.", { groups: [
    { n: "H1-KEY", m: "Seoi, Riina, Hwiseo, Yel." } ] }),
  E("Sublime", "Independent Label", "Multi-artist agency of Rain & GOT7's Youngjae.", { groups: [
    { n: "Rain", m: "Soloist & actor (Jung Ji-hoon)." },
    { n: "Youngjae", m: "Soloist (of GOT7)." },
    { n: "Hani", m: "Actress / singer (of EXID)." } ] }),
  E("Beat Interactive", "Independent Label", "Home of A.C.E & NEWBEAT.", { groups: [
    { n: "A.C.E", m: "Jun, Donghun, Wow, Kim Byeongkwan, Chan." },
    { n: "NEWBEAT", m: "7-member boy group (2025 debut)." } ] }),
  E("Planetarium Records", "Independent Label", "R&B collective label.", { groups: [
    { n: "Gaho", m: "Soloist / producer (Itaewon Class OST)." },
    { n: "June", m: "Singer-songwriter." } ] }),
  E("GRID Entertainment", "Independent Label", "Rising indie behind POW.", { groups: [
    { n: "POW", m: "Yorch, Hyunbin, Jungbin, Dongyeon, Hong." } ] }),
  E("Highline Entertainment", "Independent Label", "Wonho's home label.", { groups: [
    { n: "WONHO", m: "Soloist (former MONSTA X)." } ] }),
  E("ODE Entertainment", "Independent Label", "Founded by Super Junior's D&E.", { groups: [
    { n: "SUPER JUNIOR-D&E", m: "Donghae, Eunhyuk." } ] }),
  E("ODD ATELIER", "Independent Label", "Jennie's creative label.", { groups: [
    { n: "JENNIE", m: "Soloist (of BLACKPINK)." } ] }),
  E("BLISSOO", "Independent Label", "Jisoo's personal label.", { groups: [
    { n: "JISOO", m: "Soloist (of BLACKPINK)." } ] }),

  /* ---------- BOUTIQUE INDEPENDENT (20) ---------- */
  E("LLOUD", "Boutique Independent", "Lisa's global artist company.", { groups: [
    { n: "LISA", m: "Soloist (of BLACKPINK)." } ] }),
  E("Galaxy Corporation", "Boutique Independent", "AI-tech entertainment label of G-DRAGON.", { groups: [
    { n: "G-DRAGON", m: "Soloist (BIGBANG leader)." } ] }),
  E("VT Entertainment", "Boutique Independent", "Home of Peak Time champion band VANNER.", { groups: [
    { n: "VANNER", m: "Taehwan, Gon, Hyeseong, Sungkook, Yeonggwang." } ] }),
  E("TR Entertainment", "Boutique Independent", "Universal-collab house of TRI.BE.", { groups: [
    { n: "TRI.BE", m: "Songsun, Kelly, Hyunbin, Jia, Soeun, Mire." } ] }),
  E("M25 Entertainment", "Boutique Independent", "Home of CLASS:y.", { groups: [
    { n: "CLASS:y", m: "Hyungseo, Chaewon, Hyerin, Riwon, Jimin, Boeun, Seonyou." } ] }),
  E("MNH Entertainment", "Boutique Independent", "Chungha-founded-lineage label now housing 8TURN.", { groups: [
    { n: "8TURN", m: "Myungho, Jaeyun, Minho, Yoonsung, Haemin, Kyungmin, Yungyu, Seungheon." } ] }),
  E("KM Entertainment", "Boutique Independent", "Home of ICHILLIN'.", { groups: [
    { n: "ICHILLIN'", m: "E.Ji, Chowon, Jackie, Joonie, Chaerin." } ] }),
  E("Tamago Production", "Boutique Independent", "Creator-led house of band QWER.", { groups: [
    { n: "QWER", m: "Chodan, Magenta, Hina, Siyeon." } ] }),
  E("NV Entertainment", "Boutique Independent", "Home of monster rookies DXMON.", { groups: [
    { n: "DXMON", m: "Minjae, Seita, Hee, TK, Rex, Jo." } ] }),
  E("WUZO Entertainment", "Boutique Independent", "Home of BLITZERS.", { groups: [
    { n: "BLITZERS", m: "Jinhwa, Go_U, Juhan, Sya, Lutan, Wooju, Chris." } ] }),
  E("K-Tigers Entertainment", "Boutique Independent", "Taekwondo-performance fusion label.", { groups: [
    { n: "K-TIGERS", m: "Taekwondo demonstration & idol crossover troupe." } ] }),
  E("Parastar Entertainment", "Boutique Independent", "Barrier-free label behind BIG OCEAN.", { groups: [
    { n: "BIG OCEAN", m: "Chanyeon, Hyunjin, Jiseok — first hard-of-hearing idol group." } ] }),
  E("Metaverse Entertainment", "Boutique Independent", "Virtual-idol pioneer label.", { groups: [
    { n: "MAVE:", m: "Siu, Zena, Tyra, Marty — AI virtual girl group." } ] }),
  E("VLAST", "Boutique Independent", "Virtual-idol tech studio of PLAVE.", { groups: [
    { n: "PLAVE", m: "Yejun, Noah, Bamby, Eunho, Hamin — virtual boy group." } ] }),
  E("Deep Studio Entertainment", "Boutique Independent", "Home of SUPERKIND.", { groups: [
    { n: "SUPERKIND", m: "Daemon, Eugene, Geon, SiO, JDV." } ] }),
  E("Great M Entertainment", "Boutique Independent", "Home of 82MAJOR.", { groups: [
    { n: "82MAJOR", m: "Nam Seongmo, Park Seokjun, Yoon Yechan, Cho Seongil, Hwang Seongbin, Kim Dokyun." } ] }),
  E("Escrow Entertainment", "Boutique Independent", "Home of global girl group X:IN.", { groups: [
    { n: "X:IN", m: "E.Sha, Nizz, Nova, Hannah, Aria." } ] }),
  E("One Cool Jacso", "Boutique Independent", "Hong Kong-Korea label of XODIAC.", { groups: [
    { n: "XODIAC", m: "Lex, Hyunsik, Zayyan, Beomsoo, Gyumin, Wain, Sing, Davin, Leo." } ] }),
  E("Titan Content", "Boutique Independent", "US-Korea venture behind AtHeart.", { groups: [
    { n: "AtHeart", m: "Global girl group (2025 debut)." } ] }),
  E("LAPONE Entertainment", "Boutique Independent", "CJ × Yoshimoto joint label (JO1 & INI).", { groups: [
    { n: "JO1", m: "11-member Japanese boy group (Produce 101 Japan)." },
    { n: "INI", m: "11-member Japanese boy group (Produce 101 Japan S2)." } ] }),

  /* ---------- UNITS (10) ---------- */
  E("SuperM", "Units", "Cross-agency SM × Capitol supergroup.", { groups: [
    { n: "SuperM", m: "Taemin, Baekhyun, Kai, Taeyong, Ten, Mark (+ Lucas, on hiatus)." } ] }),
  E("GOT the beat", "Units", "SM female super-unit (Girls On Top project).", { groups: [
    { n: "GOT the beat", m: "BoA, Taeyeon, Hyoyeon, Seulgi, Wendy, Karina, Winter." } ] }),
  E("BSS (SEVENTEEN)", "Units", "SEVENTEEN's hyper-energy sub-unit.", { groups: [
    { n: "BooSeokSoon", m: "Seungkwan, DK, Hoshi." } ] }),
  E("EXO-SC", "Units", "EXO hip-hop duo line.", { groups: [
    { n: "EXO-SC", m: "Sehun, Chanyeol." } ] }),
  E("MAMAMOO+", "Units", "MAMAMOO duo unit.", { groups: [
    { n: "MAMAMOO+", m: "Solar, Moonbyul." } ] }),
  E("3RACHA", "Units", "Stray Kids' production core unit.", { groups: [
    { n: "3RACHA", m: "CB97 (Bang Chan), SPEARB (Changbin), J.ONE (Han)." } ] }),
  E("SUPER JUNIOR-K.R.Y.", "Units", "Super Junior's first official ballad unit.", { groups: [
    { n: "K.R.Y.", m: "Kyuhyun, Ryeowook, Yesung." } ] }),
  E("Girls' Generation-TTS", "Units", "SNSD's vocal line unit.", { groups: [
    { n: "TTS (TaeTiSeo)", m: "Taeyeon, Tiffany, Seohyun." } ] }),
  E("Jus2", "Units", "GOT7 R&B duo unit.", { groups: [
    { n: "Jus2", m: "Jay B, Yugyeom." } ] }),
  E("NCT DoJaeJung", "Units", "NCT's sultry vocal trio unit.", { groups: [
    { n: "NCT DoJaeJung", m: "Doyoung, Jaehyun, Jungwoo." } ] }),

  /* ---------- EXTENDED REGISTRY & LEGACY (41) ---------- */
  E("MBK Entertainment", "Extended Registry & Legacy", "T-ara & DIA's historic home; operations archived.", { kind: "corp", note: "Legacy registry entry — label operations ceased; artist contracts concluded." }),
  E("TS Entertainment", "Extended Registry & Legacy", "B.A.P & Secret's former home (defunct).", { kind: "corp", note: "Legacy registry entry — agency dissolved after contract disputes; archive kept for reference." }),
  E("Star Empire Entertainment", "Extended Registry & Legacy", "ZE:A, 9Muses & Jewelry lineage; operations folded.", { kind: "corp", note: "Legacy entry — folded into Kakao-era holdings network." }),
  E("DR Music", "Extended Registry & Legacy", "RANIA / BLACKSWAN lineage.", { kind: "corp", note: "Legacy entry — BLACKSWAN concluded activities; registry archived." }),
  E("Yedang Entertainment", "Extended Registry & Legacy", "C-Clown & early EXID-era label (defunct).", { kind: "corp", note: "Legacy entry — merged and rebranded across Banana Culture era." }),
  E("Core Contents Media", "Extended Registry & Legacy", "T-ara & Davichi golden-era label; absorbed by MBK.", { kind: "corp", note: "Legacy entry — absorbed into MBK umbrella." }),
  E("LOEN Tree", "Extended Registry & Legacy", "Kakao precursor label (IU's early home).", { kind: "corp", note: "Legacy entry — restructured into Kakao M label system." }),
  E("Nega Network", "Extended Registry & Legacy", "Brown Eyed Girls' former home.", { kind: "corp", note: "Legacy entry — artist contracts concluded; catalog standalone." }),
  E("Banana Culture", "Extended Registry & Legacy", "EXID's later home.", { kind: "corp", note: "Legacy entry — ceased operations; EXID continues independently." }),
  E("Imagine Asia", "Extended Registry & Legacy", "Multi-label holding group (archived).", { kind: "corp", note: "Legacy entry — holding assets redistributed." }),
  E("Wellmade Yedang", "Extended Registry & Legacy", "Actor & singer management (archived).", { kind: "corp", note: "Legacy entry — roster dispersed to modern agencies." }),
  E("Stardom Entertainment", "Extended Registry & Legacy", "EvoL & early hip-hop rosters (defunct).", { kind: "corp", note: "Legacy entry — merged during 2010s label consolidation." }),
  E("YMC Entertainment", "Extended Registry & Legacy", "Wanna One project-era management label.", { kind: "corp", note: "Legacy entry — project era concluded 2019." }),
  E("Swing Entertainment", "Extended Registry & Legacy", "Wanna One / X1 project management label.", { kind: "corp", note: "Legacy entry — project groups concluded; merged structures." }),
  E("Off The Record", "Extended Registry & Legacy", "IZ*ONE & fromis_9 project label (defunct).", { kind: "corp", note: "Legacy entry — closed after Produce-era projects ended." }),
  E("Studio Blu", "Extended Registry & Legacy", "I.O.I project-era label.", { kind: "corp", note: "Legacy entry — dissolved post I.O.I era." }),
  E("MMO Entertainment", "Extended Registry & Legacy", "Wanna One members' former home (CJ project).", { kind: "corp", note: "Legacy entry — folded into WAKEONE structure." }),
  E("Polaris Entertainment", "Extended Registry & Legacy", "Ladies' Code's former home.", { kind: "corp", note: "Legacy entry — operations wound down; members independent." }),
  E("Music Works", "Extended Registry & Legacy", "MYTEEN / Kriesha Chu former home.", { kind: "corp", note: "Legacy entry — roster contracts concluded." }),
  E("Maroo Entertainment", "Extended Registry & Legacy", "TEEN TEEN / 1THE9's home (dissolved).", { kind: "corp", note: "Legacy entry — company dissolved; artists relocated." }),
  E("Hunus Entertainment", "Extended Registry & Legacy", "ELRIS / ALICE's former home.", { kind: "corp", note: "Legacy entry — ALICE concluded activities 2024." }),
  E("Chrome Entertainment", "Extended Registry & Legacy", "Crayon Pop's former home.", { kind: "corp", note: "Legacy entry — operations ceased." }),
  E("JTG Entertainment", "Extended Registry & Legacy", "Berry Good's former home.", { kind: "corp", note: "Legacy entry — group disbanded 2021." }),
  E("Dublekick Company", "Extended Registry & Legacy", "MOMOLAND's original co-label (MLD lineage).", { kind: "corp", note: "Legacy entry — reorganized into MLD Entertainment." }),
  E("Kiwi Media Group", "Extended Registry & Legacy", "Kim Jong-kook-era management (archived).", { kind: "corp", note: "Legacy entry — music arm halted." }),
  E("GNI Entertainment", "Extended Registry & Legacy", "MADTOWN's former home (defunct).", { kind: "corp", note: "Legacy entry — sold off after group disbandment." }),
  E("J. Tune Camp", "Extended Registry & Legacy", "MBLAQ&'s former home.", { kind: "corp", note: "Legacy entry — folded into J. Tune lineage." }),
  E("Rain Company", "Extended Registry & Legacy", "Rain's own early indie label (archived).", { kind: "corp", note: "Legacy entry — merged into Sublime network." }),
  E("B2M Entertainment", "Extended Registry & Legacy", "SPICA & Eric Nam's former home.", { kind: "corp", note: "Legacy entry — operations concluded." }),
  E("Mnet Media", "Extended Registry & Legacy", "Pre-CJ ENM music arm (history).", { kind: "corp", note: "Legacy entry — rebranded into Stone Music / CJ ENM." }),
  E("SM C&C", "Extended Registry & Legacy", "SM affiliate rosters absorbed into SM structure.", { kind: "corp", note: "Legacy entry — merged into SM Entertainment proper." }),
  E("SidusHQ Music", "Extended Registry & Legacy", "2EYES / g.o.d-era management arm.", { kind: "corp", note: "Legacy entry — music division discontinued." }),
  E("IOK Music (legacy)", "Extended Registry & Legacy", "B1A4-era management arm (archived).", { kind: "corp", note: "Legacy entry — music roster folded." }),
  E("C-CLOWN's Yedang Line", "Extended Registry & Legacy", "Yedang artist lineage (archived).", { kind: "corp", note: "Legacy entry — see Yedang Entertainment." }),
  E("Happy Tribe Entertainment", "Extended Registry & Legacy", "PIXY co-label (archived).", { kind: "corp", note: "Legacy entry — web3 venture concluded 2024." }),
  E("I.O.I", "Extended Registry & Legacy", "Eleven-member project girl group (2016–2017).", { groups: [
    { n: "I.O.I", m: "Nayoung, Chungha, Sejeong, Chaeyeon, Kyulkyung, Sohye, Yeonjung, Yoojung, Mina, Doyeon, Somi." } ] }),
  E("Wanna One", "Extended Registry & Legacy", "Eleven-member project boy group (2017–2019).", { groups: [
    { n: "Wanna One", m: "Jisung, Sungwoon, Minhyun, Seongwu, Jaehwan, Daniel, Jihoon, Woojin, Jinyoung, Daehwi, Guanlin." } ] }),
  E("IZ*ONE", "Extended Registry & Legacy", "Twelve-member Korea-Japan project group (2018–2021).", { groups: [
    { n: "IZ*ONE", m: "Eunbi, Sakura, Hyewon, Yena, Chaeyeon, Chaewon, Minju, Nako, Hitomi, Yuri, Yujin, Wonyoung." } ] }),
  E("X1", "Extended Registry & Legacy", "Eleven-member project boy group (2019).", { groups: [
    { n: "X1", m: "Seungwoo, Seungyoun, Wooseok, Yohan, Hangyul, Junho, Dongpyo, Minhee, Eunsang, Hyeongjun, Dohyon." } ] }),
  E("PRISTIN", "Extended Registry & Legacy", "Pledis ten-member girl group (2017–2019).", { groups: [
    { n: "PRISTIN", m: "Nayoung, Roa, Yuha, Eunwoo, Rena, Kyulkyung, Yehana, Sungyeon, Xiyeon, Kyla." } ] }),

  /* ---------- SOLOISTS & INDEPENDENT ARTISTS (32) ---------- */
  E("SUNMI", "Soloists & Independent Artists", "Solo force (former Wonder Girls).", { kind: "solo", note: "Independent soloist — make-up artist & songwriter; 'Gashina', 'Stranger'." }),
  E("KIM CHUNG HA", "Soloists & Independent Artists", "Dance-diva soloist (former I.O.I).", { kind: "solo", note: "'Gotta Go', 'Snapping'. MORE VISION era artistry." }),
  E("HYUNA", "Soloists & Independent Artists", "Iconic soloist & style muse.", { kind: "solo", note: "Former 4MINUTE / Trouble Maker — 'Bubble Pop!', 'I'm Not Cool'." }),
  E("TAEMIN", "Soloists & Independent Artists", "SHINee's ace solo line (BPM).", { kind: "solo", note: "'Move', 'Guilty' — performance benchmark soloist." }),
  E("KAI", "Soloists & Independent Artists", "EXO's performance solo.", { kind: "solo", note: "'Mmmh', 'Rover' — SM / solo registry." }),
  E("TAEYEON", "Soloists & Independent Artists", "SNSD's OST queen solo (SM).", { kind: "solo", note: "'I', 'INVU' — SM Entertainment soloist." }),
  E("NAYEON", "Soloists & Independent Artists", "TWICE solo line (JYP).", { kind: "solo", note: "'POP!', 'ABCD' — JYP Entertainment." }),
  E("JIHYO", "Soloists & Independent Artists", "TWICE leader turned soloist (JYP).", { kind: "solo", note: "'Killin' Me Good' — JYP Entertainment." }),
  E("CHOI YENA", "Soloists & Independent Artists", "Soloist (former IZ*ONE) — Yuehua.", { kind: "solo", note: "'SMILEY', 'NEMONEMO' — Yuehua Entertainment." }),
  E("YUGYEOM", "Soloists & Independent Artists", "GOT7's dance solo (AOMG).", { kind: "solo", note: "'All Your Fault' — AOMG." }),
  E("JAY B", "Soloists & Independent Artists", "GOT7 leader, R&B solo (under H1GHR/CDNZA lineage).", { kind: "solo", note: "'B.T.W', 'Rocking Chair'." }),
  E("BamBam", "Soloists & Independent Artists", "GOT7's Thai global solo.", { kind: "solo", note: "'riBBon', 'Sour & Sweet' — ABYSS lineage, independent." }),
  E("JACKSON WANG", "Soloists & Independent Artists", "GOT7's global solo — TEAM WANG.", { kind: "solo", note: "TEAM WANG founder — '100 Ways', 'Cheetah'." }),
  E("B.I", "Soloists & Independent Artists", "131 Label founder (former iKON leader).", { kind: "solo", note: "'BTBT', 'COSMOS' — 131 exclusive." }),
  E("HEIZE", "Soloists & Independent Artists", "Chart-locking R&B soloist (P Nation).", { kind: "solo", note: "'And July', 'Happen' — P Nation." }),
  E("DEAN", "Soloists & Independent Artists", "R&B visionary (you.will.knovv).", { kind: "solo", note: "'D (Half Moon)', 'Instagram'." }),
  E("DPR IAN", "Soloists & Independent Artists", "DPR visual-music auteur.", { kind: "solo", note: "Dream Perfect Regime — 'Mito' universe." }),
  E("AILEE", "Soloists & Independent Artists", "Korea's vocal powerhouse soloist.", { kind: "solo", note: "'I Will Show You', 'Heaven' — A2Z lineage, independent." }),
  E("ERIC NAM", "Soloists & Independent Artists", "Singer & global K-media host.", { kind: "solo", note: "Independent — DIVE Studios co-founder." }),
  E("HOLLAND", "Soloists & Independent Artists", "Independent LGBTQ+ trailblazer soloist.", { kind: "solo", note: "Self-managed — 'Nar_C', 'I'm Not Afraid'." }),
  E("AleXa", "Soloists & Independent Artists", "Global-concept soloist (ZB Label).", { kind: "solo", note: "'Bomb', 'Wonderland' — American Song Contest winner." }),
  E("WOODZ", "Soloists & Independent Artists", "Cho Seung-youn's alt-rock solo (EDAM lineage).", { kind: "solo", note: "'Drowning', 'Love Me Harder'." }),
  E("SEORI", "Soloists & Independent Artists", "Indie-R&B chanteuse.", { kind: "solo", note: "'The Long Night', TXT collabs — ATISPAUS lineage." }),
  E("BIBI", "Soloists & Independent Artists", "Genre-bending singer-songwriter (Feel Ghood).", { kind: "solo", note: "'Bam Yang Gang', 'Vengeance'." }),
  E("PUNCH", "Soloists & Independent Artists", "Queen of K-drama OSTs.", { kind: "solo", note: "'Everytime', 'Stay With Me' — Nyam Nyam Ent." }),
  E("HA SUNG WOON", "Soloists & Independent Artists", "Wanna One's vocal solo line.", { kind: "solo", note: "'Bird', 'Strawberry Gum' — BPM lineage." }),
  E("KIM JAE HWAN", "Soloists & Independent Artists", "Wanna One's main-vocal soloist.", { kind: "solo", note: "Swing legacy — 'Begin Again'." }),
  E("YOON JISUNG", "Soloists & Independent Artists", "Wanna One leader turned soloist & actor.", { kind: "solo", note: "DG lineage — 'In the Rain'." }),
  E("PARK JIHOON", "Soloists & Independent Artists", "Wanna One visual turned soloist & actor.", { kind: "solo", note: "'L.O.V.E', Weak Hero Class star — YY Ent." }),
  E("KANG SEUNG YOON", "Soloists & Independent Artists", "WINNER's leader solo (YG).", { kind: "solo", note: "'Iyah', 'Born to Love You' — YG Entertainment." }),
  E("MINO", "Soloists & Independent Artists", "WINNER's hip-hop solo (YG).", { kind: "solo", note: "'Fiancé', 'Run away' — YG Entertainment." }),
  E("BOA", "Soloists & Independent Artists", "The original K-pop solo legend (SM).", { kind: "solo", note: "'No.1', 'Woman' — SM Entertainment, 25th anniversary era." }),

  /* ---------- ACTOR & MODEL AGENCIES (15) ---------- */
  E("BH Entertainment", "Actor & Model Agencies", "Home of Lee Byung-hun & Han Ji-min.", { kind: "corp", note: "Premium acting roster — Lee Byung-hun, Han Ji-min, Park Bo-young, Kim Go-eun." }),
  E("KeyEast", "Actor & Model Agencies", "Bae Yong-joon-founded management house.", { kind: "corp", note: "Actor & content management — SM-affiliated holding." }),
  E("Management SOOP", "Actor & Model Agencies", "Gong Yoo & Jeon Do-yeon's house.", { kind: "corp", note: "Prestige acting roster — Gong Yoo, Jeon Do-yeon, Seo Hyun-jin, Suzy." }),
  E("King Kong by Starship", "Actor & Model Agencies", "Starship's acting arm.", { kind: "corp", note: "Roster — Lee Kwang-soo, Yoo Yeon-seok, Shin Seung-ho, Kim Bum." }),
  E("Namoo Actors", "Actor & Model Agencies", "Park Eun-bin & Song Kang's agency.", { kind: "corp", note: "Actor management — Park Eun-bin, Song Kang, Lee Joon-gi lineage." }),
  E("Awesome ENT", "Actor & Model Agencies", "Park Seo-joon's agency.", { kind: "corp", note: "Roster — Park Seo-joon, Lee Hyun-woo, Han Ji-hye." }),
  E("Saram Entertainment", "Actor & Model Agencies", "Cho Jin-woong & Honey Lee's house.", { kind: "corp", note: "Roster — Cho Jin-woong, Honey Lee, Kim Kyung-nam." }),
  E("C-JeS Studios", "Actor & Model Agencies", "Ryu Jun-yeol & Seol Kyung-gu's agency.", { kind: "corp", note: "Film-first acting roster & production slate." }),
  E("United Artists Agency (UAA)", "Actor & Model Agencies", "Song Hye-kyo's agency.", { kind: "corp", note: "Selective prestige roster — Song Hye-kyo, Yoo Ah-in lineage, Park Hyung-sik." }),
  E("HODU&U Entertainment", "Actor & Model Agencies", "Kim Hye-soo & Song Kang-ho's legendary house.", { kind: "corp", note: "Cinema icons — Kim Hye-soo, Song Kang-ho lineage." }),
  E("Ghost Studio", "Actor & Model Agencies", "Joo Ji-hoon-lineage actor house.", { kind: "corp", note: "Premium film & series actors roster." }),
  E("Blitzway Entertainment", "Actor & Model Agencies", "Jung Ryeo-won & Ju Ji-hun's agency.", { kind: "corp", note: "Roster — Jung Ryeo-won, Ju Ji-hun, Moon Chae-won." }),
  E("YG Stage", "Actor & Model Agencies", "YG's actor division (registry archive).", { kind: "corp", note: "YG actor management lineage — Kim Hee-ae, Cha Seung-won history." }),
  E("IOK Company", "Actor & Model Agencies", "Go Hyun-jung & Jo In-sung's agency.", { kind: "corp", note: "Roster — Go Hyun-jung, Jo In-sung, Kim Ha-neul." }),
  E("YG KPlus", "Actor & Model Agencies", "Korea's premier model management.", { kind: "corp", note: "Model network — fashion week & editorial roster (YG lineage)." }),
  E("HighZium Studio", "Actor & Model Agencies", "Song Joong-ki's agency.", { kind: "corp", note: "Roster — Song Joong-ki, Go Bo-gyeol, Lim Chul-soo." }),
];

export const CATEGORIES: ("All" | Cat)[] = [
  "All",
  "Big 4 Ecosystem",
  "Conglomerate Subsidiary",
  "Independent Label",
  "Boutique Independent",
  "Units",
  "Extended Registry & Legacy",
  "Soloists & Independent Artists",
  "Actor & Model Agencies",
];

export const TOTAL = matrix.length;

/* All groups flattened for the Target Artist / Group select */
export const allGroups: string[] = Array.from(
  new Set(matrix.flatMap((c) => (c.groups ?? []).map((g) => g.n)))
);
