/**
 * WhatsApp Message Translations
 * Supports 7 Indian languages + English
 */

export interface ProductPreviewData {
  title: string;
  description: string;
  price: number;
  productId: string;
}

export class WhatsAppTranslations {
  /**
   * Get product preview message in specified language
   */
  static getProductPreview(product: ProductPreviewData, language: string = 'english'): string {
    const priceFormatted = `₹${(product.price / 100).toFixed(2)}`;
    
    const messages: Record<string, string> = {
      english: `✨ *Your Product Listing is Ready!*

*${product.title}*

${product.description}

💰 Suggested Price: ${priceFormatted}

🔗 Product ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*To publish this listing:*
✅ Reply "Yes" or "Approve" or "1"

*To make changes, just tell me:*
✏️ "Change price to 1500"
✏️ "Change title to Beautiful Pot"
✏️ "Update description: This is..."

*To start over:*
❌ Reply "No" or send a new photo`,

      hindi: `✨ *आपकी उत्पाद सूची तैयार है!*

*${product.title}*

${product.description}

💰 सुझाया गया मूल्य: ${priceFormatted}

🔗 उत्पाद ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*इस सूची को प्रकाशित करने के लिए:*
✅ "हां" या "स्वीकृत" या "1" लिखें

*बदलाव करने के लिए, बस बताएं:*
✏️ "मूल्य 1500 में बदलें"
✏️ "शीर्षक बदलें सुंदर बर्तन"
✏️ "विवरण अपडेट करें: यह..."

*फिर से शुरू करने के लिए:*
❌ "नहीं" लिखें या नई फोटो भेजें`,

      tamil: `✨ *உங்கள் தயாரிப்பு பட்டியல் தயார்!*

*${product.title}*

${product.description}

💰 பரிந்துரைக்கப்பட்ட விலை: ${priceFormatted}

🔗 தயாரிப்பு ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*இந்த பட்டியலை வெளியிட:*
✅ "ஆம்" அல்லது "ஒப்புதல்" அல்லது "1" என்று பதிலளிக்கவும்

*மாற்றங்களுக்கு, சொல்லுங்கள்:*
✏️ "விலையை 1500 ஆக மாற்று"
✏️ "தலைப்பை அழகான பானை என மாற்று"
✏️ "விளக்கத்தை புதுப்பிக்கவும்: இது..."

*மீண்டும் தொடங்க:*
❌ "இல்லை" என்று பதிலளிக்கவும் அல்லது புதிய புகைப்படம் அனுப்பவும்`,

      telugu: `✨ *మీ ఉత్పత్తి జాబితా సిద్ధంగా ఉంది!*

*${product.title}*

${product.description}

💰 సూచించిన ధర: ${priceFormatted}

🔗 ఉత్పత్తి ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*ఈ జాబితాను ప్రచురించడానికి:*
✅ "అవును" లేదా "ఆమోదించు" లేదా "1" అని రిప్లై చేయండి

*మార్పులు చేయడానికి, చెప్పండి:*
✏️ "ధరను 1500కి మార్చండి"
✏️ "శీర్షికను అందమైన కుండగా మార్చండి"
✏️ "వివరణను నవీకరించండి: ఇది..."

*మళ్లీ ప్రారంభించడానికి:*
❌ "కాదు" అని రిప్లై చేయండి లేదా కొత్త ఫోటో పంపండి`,

      malayalam: `✨ *നിങ്ങളുടെ ഉൽപ്പന്ന ലിസ്റ്റിംഗ് തയ്യാറാണ്!*

*${product.title}*

${product.description}

💰 നിർദ്ദേശിച്ച വില: ${priceFormatted}

🔗 ഉൽപ്പന്ന ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*ഈ ലിസ്റ്റിംഗ് പ്രസിദ്ധീകരിക്കാൻ:*
✅ "അതെ" അല്ലെങ്കിൽ "അംഗീകരിക്കുക" അല്ലെങ്കിൽ "1" എന്ന് മറുപടി നൽകുക

*മാറ്റങ്ങൾക്ക്, പറയുക:*
✏️ "വില 1500 ആയി മാറ്റുക"
✏️ "ശീർഷകം മനോഹരമായ പാത്രം എന്ന് മാറ്റുക"
✏️ "വിവരണം അപ്ഡേറ്റ് ചെയ്യുക: ഇത്..."

*വീണ്ടും ആരംഭിക്കാൻ:*
❌ "ഇല്ല" എന്ന് മറുപടി നൽകുക അല്ലെങ്കിൽ പുതിയ ഫോട്ടോ അയയ്ക്കുക`,

      bengali: `✨ *আপনার পণ্য তালিকা প্রস্তুত!*

*${product.title}*

${product.description}

💰 প্রস্তাবিত মূল্য: ${priceFormatted}

🔗 পণ্য ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*এই তালিকা প্রকাশ করতে:*
✅ "হ্যাঁ" বা "অনুমোদন" বা "1" উত্তর দিন

*পরিবর্তনের জন্য, বলুন:*
✏️ "মূল্য 1500 এ পরিবর্তন করুন"
✏️ "শিরোনাম সুন্দর পাত্র এ পরিবর্তন করুন"
✏️ "বিবরণ আপডেট করুন: এটি..."

*আবার শুরু করতে:*
❌ "না" উত্তর দিন বা নতুন ছবি পাঠান`,

      gujarati: `✨ *તમારી ઉત્પાદન સૂચિ તૈયાર છે!*

*${product.title}*

${product.description}

💰 સૂચવેલ કિંમત: ${priceFormatted}

🔗 ઉત્પાદન ID: ${product.productId}

━━━━━━━━━━━━━━━━━━━━━
*આ સૂચિ પ્રકાશિત કરવા માટે:*
✅ "હા" અથવા "મંજૂર" અથવા "1" જવાબ આપો

*ફેરફારો માટે, કહો:*
✏️ "કિંમત 1500 માં બદલો"
✏️ "શીર્ષક સુંદર વાસણ માં બદલો"
✏️ "વર્ણન અપડેટ કરો: આ..."

*ફરીથી શરૂ કરવા માટે:*
❌ "ના" જવાબ આપો અથવા નવો ફોટો મોકલો`
    };

    return messages[language.toLowerCase()] || messages.english;
  }

  /**
   * Get approval success message
   */
  static getApprovalMessage(productTitle: string, productId: string, language: string = 'english'): string {
    const messages: Record<string, string> = {
      english: `✅ *Great! Your product has been approved!*

"${productTitle}" will be published to the marketplace shortly.

🔗 Product Link: https://artisanai.in/products/${productId}

You will receive notifications when customers view or purchase your product! 🎉`,

      hindi: `✅ *बढ़िया! आपका उत्पाद स्वीकृत हो गया है!*

"${productTitle}" जल्द ही बाज़ार में प्रकाशित किया जाएगा।

🔗 उत्पाद लिंक: https://artisanai.in/products/${productId}

जब ग्राहक आपके उत्पाद को देखेंगे या खरीदेंगे तो आपको सूचनाएं मिलेंगी! 🎉`,

      tamil: `✅ *அருமை! உங்கள் தயாரிப்பு ஒப்புதல் அளிக்கப்பட்டது!*

"${productTitle}" விரைவில் சந்தையில் வெளியிடப்படும்.

🔗 தயாரிப்பு இணைப்பு: https://artisanai.in/products/${productId}

வாடிக்கையாளர்கள் உங்கள் தயாரிப்பைப் பார்க்கும்போது அல்லது வாங்கும்போது அறிவிப்புகளைப் பெறுவீர்கள்! 🎉`,

      telugu: `✅ *గొప్ప! మీ ఉత్పత్తి ఆమోదించబడింది!*

"${productTitle}" త్వరలో మార్కెట్‌ప్లేస్‌లో ప్రచురించబడుతుంది.

🔗 ఉత్పత్తి లింక్: https://artisanai.in/products/${productId}

కస్టమర్లు మీ ఉత్పత్తిని చూసినప్పుడు లేదా కొనుగోలు చేసినప్పుడు మీకు నోటిఫికేషన్లు వస్తాయి! 🎉`,

      malayalam: `✅ *മികച്ചത്! നിങ്ങളുടെ ഉൽപ്പന്നം അംഗീകരിച്ചു!*

"${productTitle}" ഉടൻ മാർക്കറ്റ്പ്ലേസിൽ പ്രസിദ്ധീകരിക്കും.

🔗 ഉൽപ്പന്ന ലിങ്ക്: https://artisanai.in/products/${productId}

ഉപഭോക്താക്കൾ നിങ്ങളുടെ ഉൽപ്പന്നം കാണുമ്പോഴോ വാങ്ങുമ്പോഴോ നിങ്ങൾക്ക് അറിയിപ്പുകൾ ലഭിക്കും! 🎉`,

      bengali: `✅ *দুর্দান্ত! আপনার পণ্য অনুমোদিত হয়েছে!*

"${productTitle}" শীঘ্রই মার্কেটপ্লেসে প্রকাশিত হবে।

🔗 পণ্য লিঙ্ক: https://artisanai.in/products/${productId}

গ্রাহকরা আপনার পণ্য দেখলে বা কিনলে আপনি বিজ্ঞপ্তি পাবেন! 🎉`,

      gujarati: `✅ *સરસ! તમારું ઉત્પાદન મંજૂર થયું છે!*

"${productTitle}" ટૂંક સમયમાં માર્કેટપ્લેસ પર પ્રકાશિત થશે.

🔗 ઉત્પાદન લિંક: https://artisanai.in/products/${productId}

જ્યારે ગ્રાહકો તમારું ઉત્પાદન જુએ અથવા ખરીદે ત્યારે તમને સૂચનાઓ મળશે! 🎉`
    };

    return messages[language.toLowerCase()] || messages.english;
  }

  /**
   * Get rejection message
   */
  static getRejectionMessage(language: string = 'english'): string {
    const messages: Record<string, string> = {
      english: '❌ Product listing cancelled. Send a new photo whenever you\'re ready to create another listing!',
      hindi: '❌ उत्पाद सूची रद्द कर दी गई। जब भी आप दूसरी सूची बनाने के लिए तैयार हों तो नई फोटो भेजें!',
      tamil: '❌ தயாரிப்பு பட்டியல் ரத்து செய்யப்பட்டது. மற்றொரு பட்டியலை உருவாக்க நீங்கள் தயாராக இருக்கும்போது புதிய புகைப்படத்தை அனுப்பவும்!',
      telugu: '❌ ఉత్పత్తి జాబితా రద్దు చేయబడింది. మీరు మరొక జాబితాను సృష్టించడానికి సిద్ధంగా ఉన్నప్పుడు కొత్త ఫోటో పంపండి!',
      malayalam: '❌ ഉൽപ്പന്ന ലിസ്റ്റിംഗ് റദ്ദാക്കി. മറ്റൊരു ലിസ്റ്റിംഗ് സൃഷ്ടിക്കാൻ നിങ്ങൾ തയ്യാറാകുമ്പോൾ പുതിയ ഫോട്ടോ അയയ്ക്കുക!',
      bengali: '❌ পণ্য তালিকা বাতিল করা হয়েছে। আরেকটি তালিকা তৈরি করতে প্রস্তুত হলে নতুন ছবি পাঠান!',
      gujarati: '❌ ઉત્પાદન સૂચિ રદ કરવામાં આવી. જ્યારે તમે બીજી સૂચિ બનાવવા માટે તૈયાર હો ત્યારે નવો ફોટો મોકલો!'
    };

    return messages[language.toLowerCase()] || messages.english;
  }

  /**
   * Get update confirmation message
   */
  static getUpdateMessage(field: string, value: string, language: string = 'english'): string {
    const messages: Record<string, Record<string, string>> = {
      price: {
        english: `✅ *Price updated to ₹${value}*\n\nHere's your updated product:`,
        hindi: `✅ *मूल्य ₹${value} में अपडेट किया गया*\n\nयहाँ आपका अपडेट किया गया उत्पाद है:`,
        tamil: `✅ *விலை ₹${value} ஆக புதுப்பிக்கப்பட்டது*\n\nஉங்கள் புதுப்பிக்கப்பட்ட தயாரிப்பு இதோ:`,
        telugu: `✅ *ధర ₹${value}కి నవీకరించబడింది*\n\nమీ నవీకరించిన ఉత్పత్తి ఇదిగో:`,
        malayalam: `✅ *വില ₹${value} ആയി അപ്ഡേറ്റ് ചെയ്തു*\n\nനിങ്ങളുടെ അപ്ഡേറ്റ് ചെയ്ത ഉൽപ്പന്നം ഇതാ:`,
        bengali: `✅ *মূল্য ₹${value} এ আপডেট করা হয়েছে*\n\nএখানে আপনার আপডেট করা পণ্য:`,
        gujarati: `✅ *કિંમત ₹${value} માં અપડેટ કરવામાં આવી*\n\nઅહીં તમારું અપડેટ કરેલ ઉત્પાદન છે:`
      },
      title: {
        english: `✅ *Title updated!*\n\nHere's your updated product:`,
        hindi: `✅ *शीर्षक अपडेट किया गया!*\n\nयहाँ आपका अपडेट किया गया उत्पाद है:`,
        tamil: `✅ *தலைப்பு புதுப்பிக்கப்பட்டது!*\n\nஉங்கள் புதுப்பிக்கப்பட்ட தயாரிப்பு இதோ:`,
        telugu: `✅ *శీర్షిక నవీకరించబడింది!*\n\nమీ నవీకరించిన ఉత్పత్తి ఇదిగో:`,
        malayalam: `✅ *ശീർഷകം അപ്ഡേറ്റ് ചെയ്തു!*\n\nനിങ്ങളുടെ അപ്ഡേറ്റ് ചെയ്ത ഉൽപ്പന്നം ഇതാ:`,
        bengali: `✅ *শিরোনাম আপডেট করা হয়েছে!*\n\nএখানে আপনার আপডেট করা পণ্য:`,
        gujarati: `✅ *શીર્ષક અપડેટ કર્યું!*\n\nઅહીં તમારું અપડેટ કરેલ ઉત્પાદન છે:`
      },
      description: {
        english: `✅ *Description updated!*\n\nHere's your updated product:`,
        hindi: `✅ *विवरण अपडेट किया गया!*\n\nयहाँ आपका अपडेट किया गया उत्पाद है:`,
        tamil: `✅ *விளக்கம் புதுப்பிக்கப்பட்டது!*\n\nஉங்கள் புதுப்பிக்கப்பட்ட தயாரிப்பு இதோ:`,
        telugu: `✅ *వివరణ నవీకరించబడింది!*\n\nమీ నవీకరించిన ఉత్పత్తి ఇదిగో:`,
        malayalam: `✅ *വിവരണം അപ്ഡേറ്റ് ചെയ്തു!*\n\nനിങ്ങളുടെ അപ്ഡേറ്റ് ചെയ്ത ഉൽപ്പന്നം ഇതാ:`,
        bengali: `✅ *বিবরণ আপডেট করা হয়েছে!*\n\nএখানে আপনার আপডেট করা পণ্য:`,
        gujarati: `✅ *વર્ણન અપડેટ કર્યું!*\n\nઅહીં તમારું અપડેટ કરેલ ઉત્પાદન છે:`
      }
    };

    const fieldMessages = messages[field] || messages.title;
    return fieldMessages[language.toLowerCase()] || fieldMessages.english;
  }

  /**
   * Get edit guidance message
   */
  static getEditGuidanceMessage(language: string = 'english'): string {
    const messages: Record<string, string> = {
      english: `✏️ *To make changes, just tell me what you want to change:*

Examples:
• "Change price to 1500"
• "Change title to Beautiful Handmade Pot"
• "Update description: This pot is made with..."

Or send a new photo to start over!`,

      hindi: `✏️ *बदलाव करने के लिए, बस बताएं कि आप क्या बदलना चाहते हैं:*

उदाहरण:
• "मूल्य 1500 में बदलें"
• "शीर्षक बदलें सुंदर हस्तनिर्मित बर्तन"
• "विवरण अपडेट करें: यह बर्तन..."

या फिर से शुरू करने के लिए नई फोटो भेजें!`,

      tamil: `✏️ *மாற்றங்களுக்கு, நீங்கள் என்ன மாற்ற விரும்புகிறீர்கள் என்று சொல்லுங்கள்:*

எடுத்துக்காட்டுகள்:
• "விலையை 1500 ஆக மாற்று"
• "தலைப்பை அழகான கைவினை பானை என மாற்று"
• "விளக்கத்தை புதுப்பிக்கவும்: இந்த பானை..."

அல்லது மீண்டும் தொடங்க புதிய புகைப்படம் அனுப்பவும்!`,

      telugu: `✏️ *మార్పులు చేయడానికి, మీరు ఏమి మార్చాలనుకుంటున్నారో చెప్పండి:*

ఉదాహరణలు:
• "ధరను 1500కి మార్చండి"
• "శీర్షికను అందమైన చేతితో చేసిన కుండగా మార్చండి"
• "వివరణను నవీకరించండి: ఈ కుండ..."

లేదా మళ్లీ ప్రారంభించడానికి కొత్త ఫోటో పంపండి!`,

      malayalam: `✏️ *മാറ്റങ്ങൾക്ക്, നിങ്ങൾ എന്താണ് മാറ്റാൻ ആഗ്രഹിക്കുന്നതെന്ന് പറയുക:*

ഉദാഹരണങ്ങൾ:
• "വില 1500 ആയി മാറ്റുക"
• "ശീർഷകം മനോഹരമായ കൈകൊണ്ട് നിർമ്മിച്ച പാത്രം എന്ന് മാറ്റുക"
• "വിവരണം അപ്ഡേറ്റ് ചെയ്യുക: ഈ പാത്രം..."

അല്ലെങ്കിൽ വീണ്ടും ആരംഭിക്കാൻ പുതിയ ഫോട്ടോ അയയ്ക്കുക!`,

      bengali: `✏️ *পরিবর্তনের জন্য, আপনি কী পরিবর্তন করতে চান তা বলুন:*

উদাহরণ:
• "মূল্য 1500 এ পরিবর্তন করুন"
• "শিরোনাম সুন্দর হস্তনির্মিত পাত্র এ পরিবর্তন করুন"
• "বিবরণ আপডেট করুন: এই পাত্র..."

অথবা আবার শুরু করতে নতুন ছবি পাঠান!`,

      gujarati: `✏️ *ફેરફારો માટે, તમે શું બદલવા માંગો છો તે કહો:*

ઉદાહરણો:
• "કિંમત 1500 માં બદલો"
• "શીર્ષક સુંદર હસ્તનિર્મિત વાસણ માં બદલો"
• "વર્ણન અપડેટ કરો: આ વાસણ..."

અથવા ફરીથી શરૂ કરવા માટે નવો ફોટો મોકલો!`
    };

    return messages[language.toLowerCase()] || messages.english;
  }
}
