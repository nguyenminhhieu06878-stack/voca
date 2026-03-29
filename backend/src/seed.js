const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const vocabularyData = [
  // === LEVEL 1: BASIC WORDS (Từ cơ bản) ===
  
  // Animals (Động vật) - Easy
  { word: 'cat', translation: 'con mèo', category: 'animals', difficulty: 'easy', phonetic: '/kæt/', example: 'The cat is sleeping.' },
  { word: 'dog', translation: 'con chó', category: 'animals', difficulty: 'easy', phonetic: '/dɔːɡ/', example: 'My dog is very friendly.' },
  { word: 'bird', translation: 'con chim', category: 'animals', difficulty: 'easy', phonetic: '/bɜːrd/', example: 'The bird can fly high.' },
  { word: 'fish', translation: 'con cá', category: 'animals', difficulty: 'easy', phonetic: '/fɪʃ/', example: 'Fish live in water.' },
  { word: 'cow', translation: 'con bò', category: 'animals', difficulty: 'easy', phonetic: '/kaʊ/', example: 'The cow gives us milk.' },
  { word: 'pig', translation: 'con heo', category: 'animals', difficulty: 'easy', phonetic: '/pɪɡ/', example: 'The pig is pink.' },
  { word: 'duck', translation: 'con vịt', category: 'animals', difficulty: 'easy', phonetic: '/dʌk/', example: 'The duck swims in the pond.' },
  { word: 'horse', translation: 'con ngựa', category: 'animals', difficulty: 'easy', phonetic: '/hɔːrs/', example: 'The horse runs fast.' },

  // Animals - Medium
  { word: 'elephant', translation: 'con voi', category: 'animals', difficulty: 'medium', phonetic: '/ˈelɪfənt/', example: 'The elephant is very big.' },
  { word: 'tiger', translation: 'con hổ', category: 'animals', difficulty: 'medium', phonetic: '/ˈtaɪɡər/', example: 'Tigers are wild animals.' },
  { word: 'rabbit', translation: 'con thỏ', category: 'animals', difficulty: 'medium', phonetic: '/ˈræbɪt/', example: 'The rabbit hops quickly.' },
  { word: 'monkey', translation: 'con khỉ', category: 'animals', difficulty: 'medium', phonetic: '/ˈmʌŋki/', example: 'Monkeys love bananas.' },
  { word: 'lion', translation: 'con sư tử', category: 'animals', difficulty: 'medium', phonetic: '/ˈlaɪən/', example: 'The lion is the king of jungle.' },
  { word: 'giraffe', translation: 'con hươu cao cổ', category: 'animals', difficulty: 'medium', phonetic: '/dʒəˈræf/', example: 'The giraffe has a long neck.' },
  { word: 'zebra', translation: 'con ngựa vằn', category: 'animals', difficulty: 'medium', phonetic: '/ˈziːbrə/', example: 'The zebra has black and white stripes.' },
  { word: 'kangaroo', translation: 'con chuột túi', category: 'animals', difficulty: 'medium', phonetic: '/ˌkæŋɡəˈruː/', example: 'The kangaroo jumps high.' },

  // Colors (Màu sắc) - Easy
  { word: 'red', translation: 'màu đỏ', category: 'colors', difficulty: 'easy', phonetic: '/red/', example: 'The apple is red.' },
  { word: 'blue', translation: 'màu xanh dương', category: 'colors', difficulty: 'easy', phonetic: '/bluː/', example: 'The sky is blue.' },
  { word: 'green', translation: 'màu xanh lá', category: 'colors', difficulty: 'easy', phonetic: '/ɡriːn/', example: 'Grass is green.' },
  { word: 'yellow', translation: 'màu vàng', category: 'colors', difficulty: 'easy', phonetic: '/ˈjeloʊ/', example: 'The sun is yellow.' },
  { word: 'black', translation: 'màu đen', category: 'colors', difficulty: 'easy', phonetic: '/blæk/', example: 'The night is black.' },
  { word: 'white', translation: 'màu trắng', category: 'colors', difficulty: 'easy', phonetic: '/waɪt/', example: 'Snow is white.' },
  { word: 'pink', translation: 'màu hồng', category: 'colors', difficulty: 'easy', phonetic: '/pɪŋk/', example: 'She wears a pink dress.' },
  { word: 'brown', translation: 'màu nâu', category: 'colors', difficulty: 'easy', phonetic: '/braʊn/', example: 'The bear is brown.' },

  // Colors - Medium
  { word: 'purple', translation: 'màu tím', category: 'colors', difficulty: 'medium', phonetic: '/ˈpɜːrpəl/', example: 'I like purple flowers.' },
  { word: 'orange', translation: 'màu cam', category: 'colors', difficulty: 'medium', phonetic: '/ˈɔːrɪndʒ/', example: 'The orange is orange.' },
  { word: 'gray', translation: 'màu xám', category: 'colors', difficulty: 'medium', phonetic: '/ɡreɪ/', example: 'The elephant is gray.' },
  { word: 'silver', translation: 'màu bạc', category: 'colors', difficulty: 'medium', phonetic: '/ˈsɪlvər/', example: 'The car is silver.' },
  { word: 'gold', translation: 'màu vàng kim', category: 'colors', difficulty: 'medium', phonetic: '/ɡoʊld/', example: 'The ring is gold.' },

  // Numbers (Số đếm) - Easy
  { word: 'one', translation: 'số một', category: 'numbers', difficulty: 'easy', phonetic: '/wʌn/', example: 'I have one apple.' },
  { word: 'two', translation: 'số hai', category: 'numbers', difficulty: 'easy', phonetic: '/tuː/', example: 'Two plus two equals four.' },
  { word: 'three', translation: 'số ba', category: 'numbers', difficulty: 'easy', phonetic: '/θriː/', example: 'I see three birds.' },
  { word: 'four', translation: 'số bốn', category: 'numbers', difficulty: 'easy', phonetic: '/fɔːr/', example: 'There are four seasons.' },
  { word: 'five', translation: 'số năm', category: 'numbers', difficulty: 'easy', phonetic: '/faɪv/', example: 'I have five fingers.' },
  { word: 'six', translation: 'số sáu', category: 'numbers', difficulty: 'easy', phonetic: '/sɪks/', example: 'Six is an even number.' },
  { word: 'seven', translation: 'số bảy', category: 'numbers', difficulty: 'easy', phonetic: '/ˈsevən/', example: 'There are seven days in a week.' },
  { word: 'eight', translation: 'số tám', category: 'numbers', difficulty: 'easy', phonetic: '/eɪt/', example: 'Eight is my lucky number.' },
  { word: 'nine', translation: 'số chín', category: 'numbers', difficulty: 'easy', phonetic: '/naɪn/', example: 'Nine plus one equals ten.' },
  { word: 'ten', translation: 'số mười', category: 'numbers', difficulty: 'easy', phonetic: '/ten/', example: 'I can count to ten.' },

  // Numbers - Medium
  { word: 'eleven', translation: 'số mười một', category: 'numbers', difficulty: 'medium', phonetic: '/ɪˈlevən/', example: 'Eleven players in a football team.' },
  { word: 'twelve', translation: 'số mười hai', category: 'numbers', difficulty: 'medium', phonetic: '/twelv/', example: 'There are twelve months in a year.' },
  { word: 'twenty', translation: 'số hai mười', category: 'numbers', difficulty: 'medium', phonetic: '/ˈtwenti/', example: 'I am twenty years old.' },
  { word: 'thirty', translation: 'số ba mười', category: 'numbers', difficulty: 'medium', phonetic: '/ˈθɜːrti/', example: 'Thirty minutes is half an hour.' },
  { word: 'fifty', translation: 'số năm mười', category: 'numbers', difficulty: 'medium', phonetic: '/ˈfɪfti/', example: 'Fifty dollars is expensive.' },
  { word: 'hundred', translation: 'số một trăm', category: 'numbers', difficulty: 'medium', phonetic: '/ˈhʌndrəd/', example: 'One hundred is a big number.' },

  // Food & Drinks (Thức ăn & Đồ uống) - Easy
  { word: 'apple', translation: 'quả táo', category: 'food', difficulty: 'easy', phonetic: '/ˈæpəl/', example: 'An apple a day keeps the doctor away.' },
  { word: 'banana', translation: 'quả chuối', category: 'food', difficulty: 'easy', phonetic: '/bəˈnænə/', example: 'Monkeys love bananas.' },
  { word: 'bread', translation: 'bánh mì', category: 'food', difficulty: 'easy', phonetic: '/bred/', example: 'I eat bread for breakfast.' },
  { word: 'milk', translation: 'sữa', category: 'food', difficulty: 'easy', phonetic: '/mɪlk/', example: 'Milk is good for your bones.' },
  { word: 'water', translation: 'nước', category: 'food', difficulty: 'easy', phonetic: '/ˈwɔːtər/', example: 'Water is essential for life.' },
  { word: 'rice', translation: 'cơm/gạo', category: 'food', difficulty: 'easy', phonetic: '/raɪs/', example: 'Rice is a staple food.' },
  { word: 'egg', translation: 'trứng', category: 'food', difficulty: 'easy', phonetic: '/eɡ/', example: 'I had an egg for breakfast.' },
  { word: 'cake', translation: 'bánh ngọt', category: 'food', difficulty: 'easy', phonetic: '/keɪk/', example: 'The birthday cake is delicious.' },

  // Food - Medium
  { word: 'chicken', translation: 'thịt gà', category: 'food', difficulty: 'medium', phonetic: '/ˈtʃɪkɪn/', example: 'Chicken is a good source of protein.' },
  { word: 'sandwich', translation: 'bánh mì kẹp', category: 'food', difficulty: 'medium', phonetic: '/ˈsænwɪtʃ/', example: 'I made a sandwich for lunch.' },
  { word: 'pizza', translation: 'bánh pizza', category: 'food', difficulty: 'medium', phonetic: '/ˈpiːtsə/', example: 'Pizza is my favorite food.' },
  { word: 'hamburger', translation: 'bánh hamburger', category: 'food', difficulty: 'medium', phonetic: '/ˈhæmbɜːrɡər/', example: 'The hamburger is very big.' },
  { word: 'chocolate', translation: 'sô cô la', category: 'food', difficulty: 'medium', phonetic: '/ˈtʃɔːklət/', example: 'I love chocolate ice cream.' },
  { word: 'coffee', translation: 'cà phê', category: 'food', difficulty: 'medium', phonetic: '/ˈkɔːfi/', example: 'I drink coffee every morning.' },
  { word: 'orange juice', translation: 'nước cam', category: 'food', difficulty: 'medium', phonetic: '/ˈɔːrɪndʒ dʒuːs/', example: 'Orange juice is healthy.', type: 'phrase' },
  // Family (Gia đình) - Easy
  { word: 'mother', translation: 'mẹ', category: 'family', difficulty: 'easy', phonetic: '/ˈmʌðər/', example: 'My mother is very kind.' },
  { word: 'father', translation: 'bố', category: 'family', difficulty: 'easy', phonetic: '/ˈfɑːðər/', example: 'My father works hard.' },
  { word: 'baby', translation: 'em bé', category: 'family', difficulty: 'easy', phonetic: '/ˈbeɪbi/', example: 'The baby is sleeping.' },
  { word: 'boy', translation: 'bé trai', category: 'family', difficulty: 'easy', phonetic: '/bɔɪ/', example: 'The boy is playing.' },
  { word: 'girl', translation: 'bé gái', category: 'family', difficulty: 'easy', phonetic: '/ɡɜːrl/', example: 'The girl is singing.' },
  { word: 'man', translation: 'người đàn ông', category: 'family', difficulty: 'easy', phonetic: '/mæn/', example: 'The man is tall.' },
  { word: 'woman', translation: 'người phụ nữ', category: 'family', difficulty: 'easy', phonetic: '/ˈwʊmən/', example: 'The woman is beautiful.' },

  // Family - Medium
  { word: 'sister', translation: 'chị/em gái', category: 'family', difficulty: 'medium', phonetic: '/ˈsɪstər/', example: 'My sister is older than me.' },
  { word: 'brother', translation: 'anh/em trai', category: 'family', difficulty: 'medium', phonetic: '/ˈbrʌðər/', example: 'My brother plays football.' },
  { word: 'family', translation: 'gia đình', category: 'family', difficulty: 'medium', phonetic: '/ˈfæməli/', example: 'I love my family.' },
  { word: 'grandmother', translation: 'bà ngoại/bà nội', category: 'family', difficulty: 'medium', phonetic: '/ˈɡrænmʌðər/', example: 'My grandmother tells stories.' },
  { word: 'grandfather', translation: 'ông ngoại/ông nội', category: 'family', difficulty: 'medium', phonetic: '/ˈɡrænfɑːðər/', example: 'My grandfather is wise.' },
  { word: 'parents', translation: 'bố mẹ', category: 'family', difficulty: 'medium', phonetic: '/ˈperənts/', example: 'My parents love me.' },

  // Body Parts (Bộ phận cơ thể) - Easy
  { word: 'head', translation: 'đầu', category: 'body', difficulty: 'easy', phonetic: '/hed/', example: 'Put your hat on your head.' },
  { word: 'eye', translation: 'mắt', category: 'body', difficulty: 'easy', phonetic: '/aɪ/', example: 'I can see with my eyes.' },
  { word: 'nose', translation: 'mũi', category: 'body', difficulty: 'easy', phonetic: '/noʊz/', example: 'I smell with my nose.' },
  { word: 'mouth', translation: 'miệng', category: 'body', difficulty: 'easy', phonetic: '/maʊθ/', example: 'I eat with my mouth.' },
  { word: 'ear', translation: 'tai', category: 'body', difficulty: 'easy', phonetic: '/ɪr/', example: 'I hear with my ears.' },
  { word: 'hand', translation: 'tay', category: 'body', difficulty: 'easy', phonetic: '/hænd/', example: 'I write with my hand.' },
  { word: 'foot', translation: 'chân', category: 'body', difficulty: 'easy', phonetic: '/fʊt/', example: 'I walk with my feet.' },
  { word: 'hair', translation: 'tóc', category: 'body', difficulty: 'easy', phonetic: '/her/', example: 'My hair is black.' },

  // Body Parts - Medium
  { word: 'finger', translation: 'ngón tay', category: 'body', difficulty: 'medium', phonetic: '/ˈfɪŋɡər/', example: 'I have ten fingers.' },
  { word: 'shoulder', translation: 'vai', category: 'body', difficulty: 'medium', phonetic: '/ˈʃoʊldər/', example: 'My shoulder hurts.' },
  { word: 'stomach', translation: 'bụng', category: 'body', difficulty: 'medium', phonetic: '/ˈstʌmək/', example: 'My stomach is full.' },
  { word: 'knee', translation: 'đầu gối', category: 'body', difficulty: 'medium', phonetic: '/niː/', example: 'I hurt my knee.' },
  { word: 'elbow', translation: 'khuỷu tay', category: 'body', difficulty: 'medium', phonetic: '/ˈelboʊ/', example: 'Bend your elbow.' },

  // School & Education (Trường học) - Easy
  { word: 'book', translation: 'sách', category: 'school', difficulty: 'easy', phonetic: '/bʊk/', example: 'I read a book every day.' },
  { word: 'pen', translation: 'bút', category: 'school', difficulty: 'easy', phonetic: '/pen/', example: 'I write with a pen.' },
  { word: 'school', translation: 'trường học', category: 'school', difficulty: 'easy', phonetic: '/skuːl/', example: 'I go to school every day.' },
  { word: 'bag', translation: 'cặp sách', category: 'school', difficulty: 'easy', phonetic: '/bæɡ/', example: 'My school bag is heavy.' },
  { word: 'desk', translation: 'bàn học', category: 'school', difficulty: 'easy', phonetic: '/desk/', example: 'I sit at my desk.' },
  { word: 'chair', translation: 'ghế', category: 'school', difficulty: 'easy', phonetic: '/tʃer/', example: 'The chair is comfortable.' },

  // School - Medium
  { word: 'teacher', translation: 'giáo viên', category: 'school', difficulty: 'medium', phonetic: '/ˈtiːtʃər/', example: 'My teacher is very nice.' },
  { word: 'student', translation: 'học sinh', category: 'school', difficulty: 'medium', phonetic: '/ˈstuːdənt/', example: 'I am a good student.' },
  { word: 'classroom', translation: 'lớp học', category: 'school', difficulty: 'medium', phonetic: '/ˈklæsruːm/', example: 'Our classroom is big.' },
  { word: 'homework', translation: 'bài tập về nhà', category: 'school', difficulty: 'medium', phonetic: '/ˈhoʊmwɜːrk/', example: 'I do my homework every day.' },
  { word: 'pencil', translation: 'bút chì', category: 'school', difficulty: 'medium', phonetic: '/ˈpensəl/', example: 'I draw with a pencil.' },
  { word: 'eraser', translation: 'tẩy', category: 'school', difficulty: 'medium', phonetic: '/ɪˈreɪsər/', example: 'Use the eraser to fix mistakes.' },
  { word: 'notebook', translation: 'vở ghi', category: 'school', difficulty: 'medium', phonetic: '/ˈnoʊtbʊk/', example: 'I write in my notebook.' },

  // === LEVEL 2: INTERMEDIATE WORDS & PHRASES ===

  // Weather (Thời tiết) - Easy to Medium
  { word: 'sun', translation: 'mặt trời', category: 'weather', difficulty: 'easy', phonetic: '/sʌn/', example: 'The sun is bright today.' },
  { word: 'rain', translation: 'mưa', category: 'weather', difficulty: 'easy', phonetic: '/reɪn/', example: 'It will rain tomorrow.' },
  { word: 'snow', translation: 'tuyết', category: 'weather', difficulty: 'easy', phonetic: '/snoʊ/', example: 'Snow is white and cold.' },
  { word: 'wind', translation: 'gió', category: 'weather', difficulty: 'easy', phonetic: '/wɪnd/', example: 'The wind is strong today.' },
  { word: 'cloud', translation: 'đám mây', category: 'weather', difficulty: 'medium', phonetic: '/klaʊd/', example: 'The clouds are gray.' },
  { word: 'hot', translation: 'nóng', category: 'weather', difficulty: 'easy', phonetic: '/hɑːt/', example: 'Today is very hot.' },
  { word: 'cold', translation: 'lạnh', category: 'weather', difficulty: 'easy', phonetic: '/koʊld/', example: 'Winter is cold.' },
  { word: 'warm', translation: 'ấm', category: 'weather', difficulty: 'easy', phonetic: '/wɔːrm/', example: 'Spring is warm and nice.' },
  { word: 'cool', translation: 'mát mẻ', category: 'weather', difficulty: 'medium', phonetic: '/kuːl/', example: 'Autumn is cool.' },
  // Transportation (Phương tiện giao thông) - Easy to Medium
  { word: 'car', translation: 'ô tô', category: 'transport', difficulty: 'easy', phonetic: '/kɑːr/', example: 'My car is red.' },
  { word: 'bus', translation: 'xe buýt', category: 'transport', difficulty: 'easy', phonetic: '/bʌs/', example: 'I take the bus to school.' },
  { word: 'bike', translation: 'xe đạp', category: 'transport', difficulty: 'easy', phonetic: '/baɪk/', example: 'I ride my bike to work.' },
  { word: 'train', translation: 'tàu hỏa', category: 'transport', difficulty: 'easy', phonetic: '/treɪn/', example: 'The train is fast.' },
  { word: 'plane', translation: 'máy bay', category: 'transport', difficulty: 'easy', phonetic: '/pleɪn/', example: 'The plane flies high.' },
  { word: 'boat', translation: 'thuyền', category: 'transport', difficulty: 'easy', phonetic: '/boʊt/', example: 'The boat sails on water.' },
  { word: 'motorcycle', translation: 'xe máy', category: 'transport', difficulty: 'medium', phonetic: '/ˈmoʊtərsaɪkəl/', example: 'The motorcycle is loud.' },
  { word: 'helicopter', translation: 'trực thăng', category: 'transport', difficulty: 'medium', phonetic: '/ˈhelɪkɑːptər/', example: 'The helicopter can hover.' },

  // House & Home (Nhà cửa) - Easy to Medium
  { word: 'house', translation: 'ngôi nhà', category: 'home', difficulty: 'easy', phonetic: '/haʊs/', example: 'My house is big.' },
  { word: 'door', translation: 'cửa', category: 'home', difficulty: 'easy', phonetic: '/dɔːr/', example: 'Please close the door.' },
  { word: 'window', translation: 'cửa sổ', category: 'home', difficulty: 'easy', phonetic: '/ˈwɪndoʊ/', example: 'Open the window for fresh air.' },
  { word: 'bed', translation: 'giường', category: 'home', difficulty: 'easy', phonetic: '/bed/', example: 'I sleep in my bed.' },
  { word: 'table', translation: 'bàn', category: 'home', difficulty: 'easy', phonetic: '/ˈteɪbəl/', example: 'The table is wooden.' },
  { word: 'kitchen', translation: 'nhà bếp', category: 'home', difficulty: 'medium', phonetic: '/ˈkɪtʃən/', example: 'Mom cooks in the kitchen.' },
  { word: 'bathroom', translation: 'phòng tắm', category: 'home', difficulty: 'medium', phonetic: '/ˈbæθruːm/', example: 'The bathroom is clean.' },
  { word: 'bedroom', translation: 'phòng ngủ', category: 'home', difficulty: 'medium', phonetic: '/ˈbedruːm/', example: 'My bedroom is cozy.' },
  { word: 'living room', translation: 'phòng khách', category: 'home', difficulty: 'medium', phonetic: '/ˈlɪvɪŋ ruːm/', example: 'We watch TV in the living room.', type: 'phrase' },

  // Clothes (Quần áo) - Easy to Medium
  { word: 'shirt', translation: 'áo sơ mi', category: 'clothes', difficulty: 'easy', phonetic: '/ʃɜːrt/', example: 'I wear a white shirt.' },
  { word: 'pants', translation: 'quần dài', category: 'clothes', difficulty: 'easy', phonetic: '/pænts/', example: 'My pants are blue.' },
  { word: 'dress', translation: 'váy', category: 'clothes', difficulty: 'easy', phonetic: '/dres/', example: 'She wears a beautiful dress.' },
  { word: 'shoes', translation: 'giày', category: 'clothes', difficulty: 'easy', phonetic: '/ʃuːz/', example: 'My shoes are comfortable.' },
  { word: 'hat', translation: 'mũ', category: 'clothes', difficulty: 'easy', phonetic: '/hæt/', example: 'I wear a hat in the sun.' },
  { word: 'socks', translation: 'tất', category: 'clothes', difficulty: 'easy', phonetic: '/sɑːks/', example: 'My socks are warm.' },
  { word: 'jacket', translation: 'áo khoác', category: 'clothes', difficulty: 'medium', phonetic: '/ˈdʒækɪt/', example: 'I need a jacket when it\'s cold.' },
  { word: 'sweater', translation: 'áo len', category: 'clothes', difficulty: 'medium', phonetic: '/ˈswetər/', example: 'The sweater is soft.' },
  { word: 'skirt', translation: 'chân váy', category: 'clothes', difficulty: 'medium', phonetic: '/skɜːrt/', example: 'The skirt is short.' },

  // Sports & Activities (Thể thao & Hoạt động) - Medium
  { word: 'football', translation: 'bóng đá', category: 'sports', difficulty: 'medium', phonetic: '/ˈfʊtbɔːl/', example: 'I play football with friends.' },
  { word: 'basketball', translation: 'bóng rổ', category: 'sports', difficulty: 'medium', phonetic: '/ˈbæskɪtbɔːl/', example: 'Basketball is fun to play.' },
  { word: 'swimming', translation: 'bơi lội', category: 'sports', difficulty: 'medium', phonetic: '/ˈswɪmɪŋ/', example: 'Swimming is good exercise.' },
  { word: 'running', translation: 'chạy bộ', category: 'sports', difficulty: 'medium', phonetic: '/ˈrʌnɪŋ/', example: 'I go running every morning.' },
  { word: 'dancing', translation: 'nhảy múa', category: 'sports', difficulty: 'medium', phonetic: '/ˈdænsɪŋ/', example: 'Dancing makes me happy.' },
  { word: 'singing', translation: 'hát', category: 'sports', difficulty: 'medium', phonetic: '/ˈsɪŋɪŋ/', example: 'I love singing songs.' },
  { word: 'reading', translation: 'đọc sách', category: 'sports', difficulty: 'medium', phonetic: '/ˈriːdɪŋ/', example: 'Reading books is educational.' },
  { word: 'writing', translation: 'viết', category: 'sports', difficulty: 'medium', phonetic: '/ˈraɪtɪŋ/', example: 'Writing helps me express ideas.' },

  // === LEVEL 3: COMMON PHRASES & EXPRESSIONS ===

  // Basic Greetings (Lời chào cơ bản)
  { word: 'hello', translation: 'xin chào', category: 'greetings', difficulty: 'easy', phonetic: '/həˈloʊ/', example: 'Hello, how are you?' },
  { word: 'goodbye', translation: 'tạm biệt', category: 'greetings', difficulty: 'easy', phonetic: '/ɡʊdˈbaɪ/', example: 'Goodbye, see you tomorrow.' },
  { word: 'good morning', translation: 'chào buổi sáng', category: 'greetings', difficulty: 'easy', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', example: 'Good morning, how are you?', type: 'phrase' },
  { word: 'good afternoon', translation: 'chào buổi chiều', category: 'greetings', difficulty: 'medium', phonetic: '/ɡʊd ˌæftərˈnuːn/', example: 'Good afternoon, nice to see you.', type: 'phrase' },
  { word: 'good evening', translation: 'chào buổi tối', category: 'greetings', difficulty: 'medium', phonetic: '/ɡʊd ˈiːvnɪŋ/', example: 'Good evening, everyone.', type: 'phrase' },
  { word: 'good night', translation: 'chúc ngủ ngon', category: 'greetings', difficulty: 'easy', phonetic: '/ɡʊd naɪt/', example: 'Good night, sweet dreams.', type: 'phrase' },
  { word: 'thank you', translation: 'cảm ơn', category: 'greetings', difficulty: 'easy', phonetic: '/θæŋk juː/', example: 'Thank you for your help.', type: 'phrase' },
  { word: 'you are welcome', translation: 'không có gì', category: 'greetings', difficulty: 'medium', phonetic: '/juː ɑːr ˈwelkəm/', example: 'You are welcome, my friend.', type: 'phrase' },
  { word: 'excuse me', translation: 'xin lỗi', category: 'greetings', difficulty: 'medium', phonetic: '/ɪkˈskjuːz miː/', example: 'Excuse me, where is the bathroom?', type: 'phrase' },
  { word: 'I am sorry', translation: 'tôi xin lỗi', category: 'greetings', difficulty: 'medium', phonetic: '/aɪ æm ˈsɔːri/', example: 'I am sorry for being late.', type: 'phrase' },
  // Common Questions (Câu hỏi thông dụng)
  { word: 'how are you', translation: 'bạn khỏe không', category: 'questions', difficulty: 'easy', phonetic: '/haʊ ɑːr juː/', example: 'How are you today?', type: 'phrase' },
  { word: 'what is your name', translation: 'tên bạn là gì', category: 'questions', difficulty: 'medium', phonetic: '/wʌt ɪz jʊr neɪm/', example: 'What is your name, please?', type: 'phrase' },
  { word: 'how old are you', translation: 'bạn bao nhiêu tuổi', category: 'questions', difficulty: 'medium', phonetic: '/haʊ oʊld ɑːr juː/', example: 'How old are you this year?', type: 'phrase' },
  { word: 'where are you from', translation: 'bạn đến từ đâu', category: 'questions', difficulty: 'medium', phonetic: '/wer ɑːr juː frʌm/', example: 'Where are you from?', type: 'phrase' },
  { word: 'what time is it', translation: 'mấy giờ rồi', category: 'questions', difficulty: 'medium', phonetic: '/wʌt taɪm ɪz ɪt/', example: 'What time is it now?', type: 'phrase' },
  { word: 'where is the bathroom', translation: 'nhà vệ sinh ở đâu', category: 'questions', difficulty: 'hard', phonetic: '/wer ɪz ðə ˈbæθruːm/', example: 'Excuse me, where is the bathroom?', type: 'phrase' },
  { word: 'can you help me', translation: 'bạn có thể giúp tôi không', category: 'questions', difficulty: 'hard', phonetic: '/kæn juː help miː/', example: 'Can you help me with this problem?', type: 'phrase' },
  { word: 'do you speak English', translation: 'bạn có nói tiếng Anh không', category: 'questions', difficulty: 'hard', phonetic: '/duː juː spiːk ˈɪŋɡlɪʃ/', example: 'Do you speak English?', type: 'phrase' },

  // Feelings & Emotions (Cảm xúc)
  { word: 'I am happy', translation: 'tôi vui', category: 'emotions', difficulty: 'easy', phonetic: '/aɪ æm ˈhæpi/', example: 'I am happy to see you.', type: 'phrase' },
  { word: 'I am sad', translation: 'tôi buồn', category: 'emotions', difficulty: 'easy', phonetic: '/aɪ æm sæd/', example: 'I am sad because it\'s raining.', type: 'phrase' },
  { word: 'I am angry', translation: 'tôi tức giận', category: 'emotions', difficulty: 'medium', phonetic: '/aɪ æm ˈæŋɡri/', example: 'I am angry about the mistake.', type: 'phrase' },
  { word: 'I am excited', translation: 'tôi hào hứng', category: 'emotions', difficulty: 'medium', phonetic: '/aɪ æm ɪkˈsaɪtɪd/', example: 'I am excited about the trip.', type: 'phrase' },
  { word: 'I am worried', translation: 'tôi lo lắng', category: 'emotions', difficulty: 'medium', phonetic: '/aɪ æm ˈwɜːrid/', example: 'I am worried about the test.', type: 'phrase' },
  { word: 'I am surprised', translation: 'tôi ngạc nhiên', category: 'emotions', difficulty: 'hard', phonetic: '/aɪ æm sərˈpraɪzd/', example: 'I am surprised by the news.', type: 'phrase' },

  // Physical Feelings (Cảm giác thể chất)
  { word: 'I am hungry', translation: 'tôi đói', category: 'feelings', difficulty: 'easy', phonetic: '/aɪ æm ˈhʌŋɡri/', example: 'I am hungry, let\'s eat.', type: 'phrase' },
  { word: 'I am thirsty', translation: 'tôi khát', category: 'feelings', difficulty: 'easy', phonetic: '/aɪ æm ˈθɜːrsti/', example: 'I am thirsty, I need water.', type: 'phrase' },
  { word: 'I am tired', translation: 'tôi mệt', category: 'feelings', difficulty: 'easy', phonetic: '/aɪ æm ˈtaɪərd/', example: 'I am tired after work.', type: 'phrase' },
  { word: 'I am sick', translation: 'tôi bị ốm', category: 'feelings', difficulty: 'medium', phonetic: '/aɪ æm sɪk/', example: 'I am sick today.', type: 'phrase' },
  { word: 'I am hot', translation: 'tôi nóng', category: 'feelings', difficulty: 'easy', phonetic: '/aɪ æm hɑːt/', example: 'I am hot, please turn on the fan.', type: 'phrase' },
  { word: 'I am cold', translation: 'tôi lạnh', category: 'feelings', difficulty: 'easy', phonetic: '/aɪ æm koʊld/', example: 'I am cold, I need a jacket.', type: 'phrase' },

  // Daily Activities (Hoạt động hàng ngày)
  { word: 'wake up', translation: 'thức dậy', category: 'daily', difficulty: 'medium', phonetic: '/weɪk ʌp/', example: 'I wake up at 7 AM.', type: 'phrase' },
  { word: 'brush teeth', translation: 'đánh răng', category: 'daily', difficulty: 'medium', phonetic: '/brʌʃ tiːθ/', example: 'I brush my teeth every morning.', type: 'phrase' },
  { word: 'take a shower', translation: 'tắm', category: 'daily', difficulty: 'medium', phonetic: '/teɪk ə ˈʃaʊər/', example: 'I take a shower before bed.', type: 'phrase' },
  { word: 'eat breakfast', translation: 'ăn sáng', category: 'daily', difficulty: 'medium', phonetic: '/iːt ˈbrekfəst/', example: 'I eat breakfast at home.', type: 'phrase' },
  { word: 'go to work', translation: 'đi làm', category: 'daily', difficulty: 'medium', phonetic: '/ɡoʊ tuː wɜːrk/', example: 'I go to work by bus.', type: 'phrase' },
  { word: 'come home', translation: 'về nhà', category: 'daily', difficulty: 'medium', phonetic: '/kʌm hoʊm/', example: 'I come home at 6 PM.', type: 'phrase' },
  { word: 'watch TV', translation: 'xem TV', category: 'daily', difficulty: 'easy', phonetic: '/wɑːtʃ ˌtiːˈviː/', example: 'I watch TV in the evening.', type: 'phrase' },
  { word: 'go to bed', translation: 'đi ngủ', category: 'daily', difficulty: 'easy', phonetic: '/ɡoʊ tuː bed/', example: 'I go to bed at 10 PM.', type: 'phrase' },

  // Time Expressions (Biểu thức thời gian)
  { word: 'see you later', translation: 'hẹn gặp lại', category: 'time', difficulty: 'medium', phonetic: '/siː juː ˈleɪtər/', example: 'See you later, goodbye!', type: 'phrase' },
  { word: 'see you tomorrow', translation: 'hẹn gặp ngày mai', category: 'time', difficulty: 'medium', phonetic: '/siː juː təˈmɔːroʊ/', example: 'See you tomorrow at school.', type: 'phrase' },
  { word: 'have a good day', translation: 'chúc một ngày tốt lành', category: 'time', difficulty: 'hard', phonetic: '/hæv ə ɡʊd deɪ/', example: 'Have a good day at work.', type: 'phrase' },
  { word: 'have a nice weekend', translation: 'chúc cuối tuần vui vẻ', category: 'time', difficulty: 'hard', phonetic: '/hæv ə naɪs ˈwiːkend/', example: 'Have a nice weekend!', type: 'phrase' },

  // === LEVEL 4: ADVANCED PHRASES & SENTENCES ===

  // Polite Expressions (Cách nói lịch sự)
  { word: 'nice to meet you', translation: 'rất vui được gặp bạn', category: 'polite', difficulty: 'hard', phonetic: '/naɪs tuː miːt juː/', example: 'Nice to meet you, I am John.', type: 'phrase' },
  { word: 'pleased to meet you', translation: 'hân hạnh được gặp bạn', category: 'polite', difficulty: 'hard', phonetic: '/pliːzd tuː miːt juː/', example: 'Pleased to meet you, sir.', type: 'phrase' },
  { word: 'it is my pleasure', translation: 'đó là niềm vinh hạnh của tôi', category: 'polite', difficulty: 'hard', phonetic: '/ɪt ɪz maɪ ˈpleʒər/', example: 'It is my pleasure to help you.', type: 'phrase' },
  { word: 'I beg your pardon', translation: 'xin lỗi, tôi không nghe rõ', category: 'polite', difficulty: 'hard', phonetic: '/aɪ beɡ jʊr ˈpɑːrdən/', example: 'I beg your pardon, could you repeat?', type: 'phrase' },
  // Complex Sentences (Câu phức tạp)
  { word: 'I would like to order', translation: 'tôi muốn gọi món', category: 'restaurant', difficulty: 'hard', phonetic: '/aɪ wʊd laɪk tuː ˈɔːrdər/', example: 'I would like to order a pizza.', type: 'phrase' },
  { word: 'could you please help me', translation: 'bạn có thể giúp tôi được không', category: 'requests', difficulty: 'hard', phonetic: '/kʊd juː pliːz help miː/', example: 'Could you please help me find my keys?', type: 'phrase' },
  { word: 'I do not understand', translation: 'tôi không hiểu', category: 'communication', difficulty: 'medium', phonetic: '/aɪ duː nɑːt ˌʌndərˈstænd/', example: 'I do not understand this lesson.', type: 'phrase' },
  { word: 'can you speak slowly', translation: 'bạn có thể nói chậm được không', category: 'communication', difficulty: 'hard', phonetic: '/kæn juː spiːk ˈsloʊli/', example: 'Can you speak slowly, please?', type: 'phrase' },
  { word: 'I am learning English', translation: 'tôi đang học tiếng Anh', category: 'learning', difficulty: 'medium', phonetic: '/aɪ æm ˈlɜːrnɪŋ ˈɪŋɡlɪʃ/', example: 'I am learning English at school.', type: 'phrase' },
  { word: 'this is very difficult', translation: 'cái này rất khó', category: 'opinions', difficulty: 'medium', phonetic: '/ðɪs ɪz ˈveri ˈdɪfɪkəlt/', example: 'This math problem is very difficult.', type: 'phrase' },
  { word: 'that is very easy', translation: 'cái đó rất dễ', category: 'opinions', difficulty: 'medium', phonetic: '/ðæt ɪz ˈveri ˈiːzi/', example: 'That English word is very easy.', type: 'phrase' },

  // Shopping & Money (Mua sắm & Tiền bạc)
  { word: 'how much does it cost', translation: 'cái này giá bao nhiêu', category: 'shopping', difficulty: 'hard', phonetic: '/haʊ mʌtʃ dʌz ɪt kɔːst/', example: 'How much does this shirt cost?', type: 'phrase' },
  { word: 'it is too expensive', translation: 'nó quá đắt', category: 'shopping', difficulty: 'medium', phonetic: '/ɪt ɪz tuː ɪkˈspensɪv/', example: 'This car is too expensive for me.', type: 'phrase' },
  { word: 'it is very cheap', translation: 'nó rất rẻ', category: 'shopping', difficulty: 'medium', phonetic: '/ɪt ɪz ˈveri tʃiːp/', example: 'This book is very cheap.', type: 'phrase' },
  { word: 'I want to buy', translation: 'tôi muốn mua', category: 'shopping', difficulty: 'medium', phonetic: '/aɪ wɑːnt tuː baɪ/', example: 'I want to buy a new phone.', type: 'phrase' },
  { word: 'do you accept credit cards', translation: 'bạn có nhận thẻ tín dụng không', category: 'shopping', difficulty: 'hard', phonetic: '/duː juː ækˈsept ˈkredɪt kɑːrdz/', example: 'Do you accept credit cards here?', type: 'phrase' },

  // Directions (Chỉ đường)
  { word: 'turn left', translation: 'rẽ trái', category: 'directions', difficulty: 'medium', phonetic: '/tɜːrn left/', example: 'Turn left at the traffic light.', type: 'phrase' },
  { word: 'turn right', translation: 'rẽ phải', category: 'directions', difficulty: 'medium', phonetic: '/tɜːrn raɪt/', example: 'Turn right after the bridge.', type: 'phrase' },
  { word: 'go straight', translation: 'đi thẳng', category: 'directions', difficulty: 'medium', phonetic: '/ɡoʊ streɪt/', example: 'Go straight for two blocks.', type: 'phrase' },
  { word: 'it is on the left', translation: 'nó ở bên trái', category: 'directions', difficulty: 'medium', phonetic: '/ɪt ɪz ɑːn ðə left/', example: 'The bank is on the left side.', type: 'phrase' },
  { word: 'it is on the right', translation: 'nó ở bên phải', category: 'directions', difficulty: 'medium', phonetic: '/ɪt ɪz ɑːn ðə raɪt/', example: 'The store is on the right side.', type: 'phrase' },

  // Love & Relationships (Tình yêu & Mối quan hệ)
  { word: 'I love you', translation: 'tôi yêu bạn', category: 'love', difficulty: 'easy', phonetic: '/aɪ lʌv juː/', example: 'I love you very much.', type: 'phrase' },
  { word: 'I miss you', translation: 'tôi nhớ bạn', category: 'love', difficulty: 'medium', phonetic: '/aɪ mɪs juː/', example: 'I miss you when you are away.', type: 'phrase' },
  { word: 'you are beautiful', translation: 'bạn rất đẹp', category: 'compliments', difficulty: 'medium', phonetic: '/juː ɑːr ˈbjuːtɪfəl/', example: 'You are beautiful today.', type: 'phrase' },
  { word: 'you are handsome', translation: 'bạn rất đẹp trai', category: 'compliments', difficulty: 'medium', phonetic: '/juː ɑːr ˈhænsəm/', example: 'You are handsome in that suit.', type: 'phrase' },
  { word: 'you are very kind', translation: 'bạn rất tốt bụng', category: 'compliments', difficulty: 'medium', phonetic: '/juː ɑːr ˈveri kaɪnd/', example: 'You are very kind to help me.', type: 'phrase' },

  // Emergency & Health (Khẩn cấp & Sức khỏe)
  { word: 'call the police', translation: 'gọi cảnh sát', category: 'emergency', difficulty: 'hard', phonetic: '/kɔːl ðə pəˈliːs/', example: 'Please call the police immediately.', type: 'phrase' },
  { word: 'call an ambulance', translation: 'gọi xe cứu thương', category: 'emergency', difficulty: 'hard', phonetic: '/kɔːl æn ˈæmbjələns/', example: 'Call an ambulance, someone is hurt.', type: 'phrase' },
  { word: 'I need a doctor', translation: 'tôi cần bác sĩ', category: 'health', difficulty: 'medium', phonetic: '/aɪ niːd ə ˈdɑːktər/', example: 'I need a doctor, I feel sick.', type: 'phrase' },
  { word: 'where is the hospital', translation: 'bệnh viện ở đâu', category: 'health', difficulty: 'hard', phonetic: '/wer ɪz ðə ˈhɑːspɪtəl/', example: 'Where is the nearest hospital?', type: 'phrase' },

  // Technology (Công nghệ)
  { word: 'turn on the computer', translation: 'bật máy tính', category: 'technology', difficulty: 'medium', phonetic: '/tɜːrn ɑːn ðə kəmˈpjuːtər/', example: 'Please turn on the computer.', type: 'phrase' },
  { word: 'connect to wifi', translation: 'kết nối wifi', category: 'technology', difficulty: 'medium', phonetic: '/kəˈnekt tuː ˈwaɪfaɪ/', example: 'I need to connect to wifi.', type: 'phrase' },
  { word: 'charge the phone', translation: 'sạc điện thoại', category: 'technology', difficulty: 'medium', phonetic: '/tʃɑːrdʒ ðə foʊn/', example: 'I need to charge my phone.', type: 'phrase' },
  { word: 'send an email', translation: 'gửi email', category: 'technology', difficulty: 'medium', phonetic: '/send æn ˈiːmeɪl/', example: 'I will send you an email later.', type: 'phrase' },

  // === ADVANCED VOCABULARY ===

  // Business & Work (Kinh doanh & Công việc)
  { word: 'meeting', translation: 'cuộc họp', category: 'business', difficulty: 'hard', phonetic: '/ˈmiːtɪŋ/', example: 'We have a meeting at 3 PM.' },
  { word: 'presentation', translation: 'bài thuyết trình', category: 'business', difficulty: 'hard', phonetic: '/ˌprezənˈteɪʃən/', example: 'The presentation was very good.' },
  { word: 'deadline', translation: 'hạn chót', category: 'business', difficulty: 'hard', phonetic: '/ˈdedlaɪn/', example: 'The deadline is next Friday.' },
  { word: 'salary', translation: 'lương', category: 'business', difficulty: 'hard', phonetic: '/ˈsæləri/', example: 'My salary is paid monthly.' },
  { word: 'interview', translation: 'phỏng vấn', category: 'business', difficulty: 'hard', phonetic: '/ˈɪntərvjuː/', example: 'I have a job interview tomorrow.' },

  // Advanced Adjectives (Tính từ nâng cao)
  { word: 'amazing', translation: 'tuyệt vời', category: 'adjectives', difficulty: 'hard', phonetic: '/əˈmeɪzɪŋ/', example: 'The view is amazing.' },
  { word: 'terrible', translation: 'khủng khiếp', category: 'adjectives', difficulty: 'hard', phonetic: '/ˈterəbəl/', example: 'The weather is terrible today.' },
  { word: 'fantastic', translation: 'tuyệt diệu', category: 'adjectives', difficulty: 'hard', phonetic: '/fænˈtæstɪk/', example: 'That was a fantastic movie.' },
  { word: 'incredible', translation: 'không thể tin được', category: 'adjectives', difficulty: 'hard', phonetic: '/ɪnˈkredəbəl/', example: 'The story is incredible.' },
  { word: 'wonderful', translation: 'tuyệt diệu', category: 'adjectives', difficulty: 'hard', phonetic: '/ˈwʌndərfəl/', example: 'We had a wonderful time.' },

  // === ADDITIONAL VOCABULARY FOR MISSING CATEGORIES ===

  // More Adjectives (Tính từ)
  { word: 'big', translation: 'to, lớn', category: 'adjectives', difficulty: 'easy', phonetic: '/bɪɡ/', example: 'The elephant is big.' },
  { word: 'small', translation: 'nhỏ', category: 'adjectives', difficulty: 'easy', phonetic: '/smɔːl/', example: 'The mouse is small.' },
  { word: 'tall', translation: 'cao', category: 'adjectives', difficulty: 'easy', phonetic: '/tɔːl/', example: 'He is very tall.' },
  { word: 'short', translation: 'thấp, ngắn', category: 'adjectives', difficulty: 'easy', phonetic: '/ʃɔːrt/', example: 'She has short hair.' },
  { word: 'beautiful', translation: 'đẹp', category: 'adjectives', difficulty: 'medium', phonetic: '/ˈbjuːtɪfəl/', example: 'The flower is beautiful.' },

  // More Feelings (Cảm giác)
  { word: 'happy', translation: 'vui vẻ', category: 'feelings', difficulty: 'easy', phonetic: '/ˈhæpi/', example: 'I feel happy today.' },
  { word: 'sad', translation: 'buồn', category: 'feelings', difficulty: 'easy', phonetic: '/sæd/', example: 'She looks sad.' },
  { word: 'angry', translation: 'tức giận', category: 'feelings', difficulty: 'easy', phonetic: '/ˈæŋɡri/', example: 'He is angry about the news.' },
  { word: 'excited', translation: 'hào hứng', category: 'feelings', difficulty: 'medium', phonetic: '/ɪkˈsaɪtɪd/', example: 'I am excited about the trip.' },
  { word: 'nervous', translation: 'lo lắng', category: 'feelings', difficulty: 'medium', phonetic: '/ˈnɜːrvəs/', example: 'She feels nervous before the test.' },

  // Directions (Chỉ đường)
  { word: 'left', translation: 'trái', category: 'directions', difficulty: 'easy', phonetic: '/left/', example: 'Turn left at the corner.' },
  { word: 'right', translation: 'phải', category: 'directions', difficulty: 'easy', phonetic: '/raɪt/', example: 'Go right after the bridge.' },
  { word: 'straight', translation: 'thẳng', category: 'directions', difficulty: 'easy', phonetic: '/streɪt/', example: 'Walk straight ahead.' },
  { word: 'north', translation: 'hướng bắc', category: 'directions', difficulty: 'medium', phonetic: '/nɔːrθ/', example: 'The city is north of here.' },
  { word: 'south', translation: 'hướng nam', category: 'directions', difficulty: 'medium', phonetic: '/saʊθ/', example: 'We are going south.' },

  // Emergency (Khẩn cấp)
  { word: 'help', translation: 'giúp đỡ', category: 'emergency', difficulty: 'easy', phonetic: '/help/', example: 'I need help!' },
  { word: 'fire', translation: 'lửa', category: 'emergency', difficulty: 'easy', phonetic: '/ˈfaɪər/', example: 'There is a fire in the building.' },
  { word: 'police', translation: 'cảnh sát', category: 'emergency', difficulty: 'medium', phonetic: '/pəˈliːs/', example: 'Call the police immediately.' },
  { word: 'ambulance', translation: 'xe cứu thương', category: 'emergency', difficulty: 'hard', phonetic: '/ˈæmbjələns/', example: 'We need an ambulance.' },
  { word: 'hospital', translation: 'bệnh viện', category: 'emergency', difficulty: 'medium', phonetic: '/ˈhɑːspɪtəl/', example: 'Take him to the hospital.' },

  // More Numbers (Số đếm)
  { word: 'six', translation: 'số sáu', category: 'numbers', difficulty: 'easy', phonetic: '/sɪks/', example: 'Six is an even number.' },
  { word: 'seven', translation: 'số bảy', category: 'numbers', difficulty: 'easy', phonetic: '/ˈsevən/', example: 'There are seven days in a week.' },
  { word: 'eight', translation: 'số tám', category: 'numbers', difficulty: 'easy', phonetic: '/eɪt/', example: 'Eight is my lucky number.' },
  { word: 'nine', translation: 'số chín', category: 'numbers', difficulty: 'easy', phonetic: '/naɪn/', example: 'Nine plus one equals ten.' },
  { word: 'ten', translation: 'số mười', category: 'numbers', difficulty: 'easy', phonetic: '/ten/', example: 'I can count to ten.' },

  // Time (Thời gian)
  { word: 'morning', translation: 'buổi sáng', category: 'time', difficulty: 'easy', phonetic: '/ˈmɔːrnɪŋ/', example: 'Good morning!' },
  { word: 'afternoon', translation: 'buổi chiều', category: 'time', difficulty: 'medium', phonetic: '/ˌæftərˈnuːn/', example: 'See you this afternoon.' },
  { word: 'evening', translation: 'buổi tối', category: 'time', difficulty: 'medium', phonetic: '/ˈiːvnɪŋ/', example: 'We have dinner in the evening.' },
  { word: 'night', translation: 'ban đêm', category: 'time', difficulty: 'easy', phonetic: '/naɪt/', example: 'Good night, sleep well.' },
  { word: 'today', translation: 'hôm nay', category: 'time', difficulty: 'easy', phonetic: '/təˈdeɪ/', example: 'Today is a beautiful day.' },

  // Learning (Học tập)
  { word: 'study', translation: 'học', category: 'learning', difficulty: 'easy', phonetic: '/ˈstʌdi/', example: 'I study English every day.' },
  { word: 'practice', translation: 'luyện tập', category: 'learning', difficulty: 'medium', phonetic: '/ˈpræktɪs/', example: 'Practice makes perfect.' },
  { word: 'lesson', translation: 'bài học', category: 'learning', difficulty: 'medium', phonetic: '/ˈlesən/', example: 'Today we have an English lesson.' },
  { word: 'homework', translation: 'bài tập về nhà', category: 'learning', difficulty: 'medium', phonetic: '/ˈhoʊmwɜːrk/', example: 'I finished my homework.' },
  { word: 'exam', translation: 'kỳ thi', category: 'learning', difficulty: 'medium', phonetic: '/ɪɡˈzæm/', example: 'The exam is next week.' },

  // Opinions (Ý kiến)
  { word: 'good', translation: 'tốt', category: 'opinions', difficulty: 'easy', phonetic: '/ɡʊd/', example: 'This is a good book.' },
  { word: 'bad', translation: 'xấu, tệ', category: 'opinions', difficulty: 'easy', phonetic: '/bæd/', example: 'The weather is bad today.' },
  { word: 'interesting', translation: 'thú vị', category: 'opinions', difficulty: 'hard', phonetic: '/ˈɪntrəstɪŋ/', example: 'The movie is very interesting.' },
  { word: 'boring', translation: 'nhàm chán', category: 'opinions', difficulty: 'medium', phonetic: '/ˈbɔːrɪŋ/', example: 'The lecture was boring.' },
  { word: 'important', translation: 'quan trọng', category: 'opinions', difficulty: 'hard', phonetic: '/ɪmˈpɔːrtənt/', example: 'Education is important.' },

  // Polite (Lịch sự)
  { word: 'please', translation: 'xin vui lòng', category: 'polite', difficulty: 'easy', phonetic: '/pliːz/', example: 'Please help me.' },
  { word: 'sorry', translation: 'xin lỗi', category: 'polite', difficulty: 'easy', phonetic: '/ˈsɔːri/', example: 'I am sorry for being late.' },
  { word: 'welcome', translation: 'chào mừng', category: 'polite', difficulty: 'medium', phonetic: '/ˈwelkəm/', example: 'You are welcome here.' },
  { word: 'pardon', translation: 'xin lỗi (không nghe rõ)', category: 'polite', difficulty: 'hard', phonetic: '/ˈpɑːrdən/', example: 'Pardon me, could you repeat that?' },
  { word: 'excuse', translation: 'xin phép', category: 'polite', difficulty: 'medium', phonetic: '/ɪkˈskjuːz/', example: 'Excuse me, where is the bathroom?' },

  // Restaurant (Nhà hàng)
  { word: 'menu', translation: 'thực đơn', category: 'restaurant', difficulty: 'medium', phonetic: '/ˈmenjuː/', example: 'Can I see the menu, please?' },
  { word: 'order', translation: 'gọi món', category: 'restaurant', difficulty: 'medium', phonetic: '/ˈɔːrdər/', example: 'I would like to order pizza.' },
  { word: 'waiter', translation: 'phục vụ bàn', category: 'restaurant', difficulty: 'medium', phonetic: '/ˈweɪtər/', example: 'The waiter is very friendly.' },
  { word: 'bill', translation: 'hóa đơn', category: 'restaurant', difficulty: 'medium', phonetic: '/bɪl/', example: 'Can I have the bill, please?' },
  { word: 'tip', translation: 'tiền tip', category: 'restaurant', difficulty: 'medium', phonetic: '/tɪp/', example: 'I left a tip for the waiter.' },

  // Requests (Yêu cầu)
  { word: 'ask', translation: 'hỏi', category: 'requests', difficulty: 'easy', phonetic: '/æsk/', example: 'Can I ask you a question?' },
  { word: 'give', translation: 'đưa cho', category: 'requests', difficulty: 'easy', phonetic: '/ɡɪv/', example: 'Please give me the book.' },
  { word: 'take', translation: 'lấy', category: 'requests', difficulty: 'easy', phonetic: '/teɪk/', example: 'Take this with you.' },
  { word: 'bring', translation: 'mang đến', category: 'requests', difficulty: 'medium', phonetic: '/brɪŋ/', example: 'Please bring me some water.' },
  { word: 'show', translation: 'chỉ cho xem', category: 'requests', difficulty: 'easy', phonetic: '/ʃoʊ/', example: 'Can you show me the way?' },

  // Communication (Giao tiếp) - Adding vocabulary for category 7
  { word: 'speak', translation: 'nói', category: 'communication', difficulty: 'easy', phonetic: '/spiːk/', example: 'I speak English.' },
  { word: 'listen', translation: 'nghe', category: 'communication', difficulty: 'easy', phonetic: '/ˈlɪsən/', example: 'Please listen carefully.' },
  { word: 'understand', translation: 'hiểu', category: 'communication', difficulty: 'medium', phonetic: '/ˌʌndərˈstænd/', example: 'I understand you.' },
  { word: 'repeat', translation: 'lặp lại', category: 'communication', difficulty: 'medium', phonetic: '/rɪˈpiːt/', example: 'Can you repeat that?' },
  { word: 'explain', translation: 'giải thích', category: 'communication', difficulty: 'hard', phonetic: '/ɪkˈspleɪn/', example: 'Please explain this to me.' },
  { word: 'talk', translation: 'nói chuyện', category: 'communication', difficulty: 'easy', phonetic: '/tɔːk/', example: 'Let\'s talk about it.' },
  { word: 'tell', translation: 'kể', category: 'communication', difficulty: 'easy', phonetic: '/tel/', example: 'Tell me your story.' },
  { word: 'say', translation: 'nói', category: 'communication', difficulty: 'easy', phonetic: '/seɪ/', example: 'What did you say?' },

  // Compliments (Khen ngợi) - Adding vocabulary for category 8
  { word: 'beautiful', translation: 'đẹp', category: 'compliments', difficulty: 'medium', phonetic: '/ˈbjuːtɪfəl/', example: 'You look beautiful today.' },
  { word: 'handsome', translation: 'đẹp trai', category: 'compliments', difficulty: 'medium', phonetic: '/ˈhænsəm/', example: 'He is very handsome.' },
  { word: 'smart', translation: 'thông minh', category: 'compliments', difficulty: 'easy', phonetic: '/smɑːrt/', example: 'You are so smart!' },
  { word: 'kind', translation: 'tốt bụng', category: 'compliments', difficulty: 'easy', phonetic: '/kaɪnd/', example: 'You are very kind.' },
  { word: 'nice', translation: 'tốt, dễ thương', category: 'compliments', difficulty: 'easy', phonetic: '/naɪs/', example: 'That\'s a nice dress.' },
  { word: 'wonderful', translation: 'tuyệt vời', category: 'compliments', difficulty: 'medium', phonetic: '/ˈwʌndərfəl/', example: 'You did a wonderful job.' },
  { word: 'amazing', translation: 'tuyệt vời', category: 'compliments', difficulty: 'hard', phonetic: '/əˈmeɪzɪŋ/', example: 'Your English is amazing!' },
  { word: 'perfect', translation: 'hoàn hảo', category: 'compliments', difficulty: 'medium', phonetic: '/ˈpɜːrfɪkt/', example: 'Your pronunciation is perfect.' },

  // Daily (Hàng ngày) - Adding vocabulary for category 9 if needed
  { word: 'morning', translation: 'buổi sáng', category: 'daily', difficulty: 'easy', phonetic: '/ˈmɔːrnɪŋ/', example: 'I wake up in the morning.' },
  { word: 'work', translation: 'làm việc', category: 'daily', difficulty: 'easy', phonetic: '/wɜːrk/', example: 'I go to work every day.' },
  { word: 'eat', translation: 'ăn', category: 'daily', difficulty: 'easy', phonetic: '/iːt/', example: 'I eat breakfast at 7 AM.' },
  { word: 'sleep', translation: 'ngủ', category: 'daily', difficulty: 'easy', phonetic: '/sliːp/', example: 'I sleep 8 hours a night.' },
  { word: 'shower', translation: 'tắm', category: 'daily', difficulty: 'easy', phonetic: '/ˈʃaʊər/', example: 'I take a shower every morning.' },
  { word: 'brush', translation: 'đánh răng', category: 'daily', difficulty: 'easy', phonetic: '/brʌʃ/', example: 'I brush my teeth twice a day.' },

  // Emotions (Cảm xúc) - Adding vocabulary for category 12 if needed  
  { word: 'love', translation: 'yêu', category: 'emotions', difficulty: 'easy', phonetic: '/lʌv/', example: 'I love my family.' },
  { word: 'like', translation: 'thích', category: 'emotions', difficulty: 'easy', phonetic: '/laɪk/', example: 'I like chocolate.' },
  { word: 'hate', translation: 'ghét', category: 'emotions', difficulty: 'easy', phonetic: '/heɪt/', example: 'I hate rainy days.' },
  { word: 'enjoy', translation: 'thích thú', category: 'emotions', difficulty: 'medium', phonetic: '/ɪnˈdʒɔɪ/', example: 'I enjoy reading books.' },
  { word: 'worry', translation: 'lo lắng', category: 'emotions', difficulty: 'medium', phonetic: '/ˈwɜːri/', example: 'Don\'t worry about it.' },
  { word: 'hope', translation: 'hy vọng', category: 'emotions', difficulty: 'medium', phonetic: '/hoʊp/', example: 'I hope you feel better.' },

  // === ADDING VOCABULARY FOR MISSING CATEGORIES (17, 20, 24, 28, 30) ===

  // Health (Sức khỏe) - Category for position 17
  { word: 'doctor', translation: 'bác sĩ', category: 'health', difficulty: 'easy', phonetic: '/ˈdɑːktər/', example: 'I need to see a doctor.' },
  { word: 'medicine', translation: 'thuốc', category: 'health', difficulty: 'medium', phonetic: '/ˈmedəsən/', example: 'Take this medicine twice a day.' },
  { word: 'sick', translation: 'ốm', category: 'health', difficulty: 'easy', phonetic: '/sɪk/', example: 'I feel sick today.' },
  { word: 'healthy', translation: 'khỏe mạnh', category: 'health', difficulty: 'medium', phonetic: '/ˈhelθi/', example: 'Eating vegetables is healthy.' },
  { word: 'pain', translation: 'đau', category: 'health', difficulty: 'easy', phonetic: '/peɪn/', example: 'I have a pain in my back.' },
  { word: 'fever', translation: 'sốt', category: 'health', difficulty: 'medium', phonetic: '/ˈfiːvər/', example: 'He has a high fever.' },

  // Love (Tình yêu) - Category for position 20
  { word: 'kiss', translation: 'hôn', category: 'love', difficulty: 'easy', phonetic: '/kɪs/', example: 'Give me a kiss.' },
  { word: 'hug', translation: 'ôm', category: 'love', difficulty: 'easy', phonetic: '/hʌɡ/', example: 'I need a hug.' },
  { word: 'heart', translation: 'trái tim', category: 'love', difficulty: 'easy', phonetic: '/hɑːrt/', example: 'You have my heart.' },
  { word: 'romantic', translation: 'lãng mạn', category: 'love', difficulty: 'hard', phonetic: '/roʊˈmæntɪk/', example: 'That was very romantic.' },
  { word: 'marry', translation: 'kết hôn', category: 'love', difficulty: 'medium', phonetic: '/ˈmæri/', example: 'Will you marry me?' },
  { word: 'boyfriend', translation: 'bạn trai', category: 'love', difficulty: 'medium', phonetic: '/ˈbɔɪfrend/', example: 'This is my boyfriend.' },
  { word: 'girlfriend', translation: 'bạn gái', category: 'love', difficulty: 'medium', phonetic: '/ˈɡɜːrlfrend/', example: 'She is my girlfriend.' },

  // Shopping (Mua sắm) - Category for position 24
  { word: 'buy', translation: 'mua', category: 'shopping', difficulty: 'easy', phonetic: '/baɪ/', example: 'I want to buy this shirt.' },
  { word: 'sell', translation: 'bán', category: 'shopping', difficulty: 'easy', phonetic: '/sel/', example: 'They sell fresh fruit here.' },
  { word: 'price', translation: 'giá', category: 'shopping', difficulty: 'easy', phonetic: '/praɪs/', example: 'What is the price of this book?' },
  { word: 'cheap', translation: 'rẻ', category: 'shopping', difficulty: 'easy', phonetic: '/tʃiːp/', example: 'This shirt is very cheap.' },
  { word: 'expensive', translation: 'đắt', category: 'shopping', difficulty: 'medium', phonetic: '/ɪkˈspensɪv/', example: 'That car is too expensive.' },
  { word: 'discount', translation: 'giảm giá', category: 'shopping', difficulty: 'hard', phonetic: '/ˈdɪskaʊnt/', example: 'Is there a discount today?' },
  { word: 'receipt', translation: 'hóa đơn', category: 'shopping', difficulty: 'medium', phonetic: '/rɪˈsiːt/', example: 'Can I have a receipt?' },

  // Technology (Công nghệ) - Category for position 28
  { word: 'computer', translation: 'máy tính', category: 'technology', difficulty: 'medium', phonetic: '/kəmˈpjuːtər/', example: 'I use a computer for work.' },
  { word: 'phone', translation: 'điện thoại', category: 'technology', difficulty: 'easy', phonetic: '/foʊn/', example: 'My phone is ringing.' },
  { word: 'internet', translation: 'mạng internet', category: 'technology', difficulty: 'medium', phonetic: '/ˈɪntərnet/', example: 'I need internet to work.' },
  { word: 'email', translation: 'thư điện tử', category: 'technology', difficulty: 'medium', phonetic: '/ˈiːmeɪl/', example: 'Send me an email.' },
  { word: 'website', translation: 'trang web', category: 'technology', difficulty: 'hard', phonetic: '/ˈwebsaɪt/', example: 'This website is very useful.' },
  { word: 'password', translation: 'mật khẩu', category: 'technology', difficulty: 'hard', phonetic: '/ˈpæswɜːrd/', example: 'Enter your password here.' },
  { word: 'download', translation: 'tải xuống', category: 'technology', difficulty: 'hard', phonetic: '/ˈdaʊnloʊd/', example: 'Download this app.' },

  // Work (Công việc) - Category for position 30
  { word: 'job', translation: 'công việc', category: 'work', difficulty: 'easy', phonetic: '/dʒɑːb/', example: 'I have a new job.' },
  { word: 'office', translation: 'văn phòng', category: 'work', difficulty: 'medium', phonetic: '/ˈɔːfɪs/', example: 'I work in an office.' },
  { word: 'boss', translation: 'sếp', category: 'work', difficulty: 'easy', phonetic: '/bɔːs/', example: 'My boss is very kind.' },
  { word: 'employee', translation: 'nhân viên', category: 'work', difficulty: 'hard', phonetic: '/ɪmˈplɔɪiː/', example: 'She is a good employee.' },
  { word: 'meeting', translation: 'cuộc họp', category: 'work', difficulty: 'medium', phonetic: '/ˈmiːtɪŋ/', example: 'We have a meeting at 3 PM.' },
  { word: 'project', translation: 'dự án', category: 'work', difficulty: 'medium', phonetic: '/ˈprɑːdʒekt/', example: 'This project is important.' },
  { word: 'deadline', translation: 'hạn chót', category: 'work', difficulty: 'hard', phonetic: '/ˈdedlaɪn/', example: 'The deadline is tomorrow.' },

  // === ADDING PHRASES & SENTENCES FOR CATEGORIES 1-6 ===

  // Adjectives Phrases & Sentences
  { word: 'very big house', translation: 'ngôi nhà rất lớn', category: 'adjectives', difficulty: 'easy', phonetic: '/ˈveri bɪɡ haʊs/', example: 'They live in a very big house.', type: 'phrase' },
  { word: 'so beautiful', translation: 'rất đẹp', category: 'adjectives', difficulty: 'medium', phonetic: '/soʊ ˈbjuːtɪfəl/', example: 'The sunset is so beautiful.', type: 'phrase' },
  { word: 'too small', translation: 'quá nhỏ', category: 'adjectives', difficulty: 'easy', phonetic: '/tuː smɔːl/', example: 'This shirt is too small for me.', type: 'phrase' },
  { word: 'It is very tall', translation: 'Nó rất cao', category: 'adjectives', difficulty: 'easy', phonetic: '/ɪt ɪz ˈveri tɔːl/', example: 'It is very tall building.', type: 'sentence' },
  { word: 'She looks beautiful today', translation: 'Hôm nay cô ấy trông rất đẹp', category: 'adjectives', difficulty: 'medium', phonetic: '/ʃi lʊks ˈbjuːtɪfəl təˈdeɪ/', example: 'She looks beautiful today in that dress.', type: 'sentence' },

  // Animals Phrases & Sentences
  { word: 'big elephant', translation: 'con voi lớn', category: 'animals', difficulty: 'easy', phonetic: '/bɪɡ ˈelɪfənt/', example: 'I saw a big elephant at the zoo.', type: 'phrase' },
  { word: 'cute cat', translation: 'con mèo dễ thương', category: 'animals', difficulty: 'easy', phonetic: '/kjuːt kæt/', example: 'That is a very cute cat.', type: 'phrase' },
  { word: 'wild animals', translation: 'động vật hoang dã', category: 'animals', difficulty: 'medium', phonetic: '/waɪld ˈænɪməlz/', example: 'Wild animals live in the forest.', type: 'phrase' },
  { word: 'The dog is running', translation: 'Con chó đang chạy', category: 'animals', difficulty: 'easy', phonetic: '/ðə dɔːɡ ɪz ˈrʌnɪŋ/', example: 'The dog is running in the park.', type: 'sentence' },
  { word: 'I love animals', translation: 'Tôi yêu động vật', category: 'animals', difficulty: 'easy', phonetic: '/aɪ lʌv ˈænɪməlz/', example: 'I love animals, especially cats.', type: 'sentence' },

  // Body Phrases & Sentences
  { word: 'wash hands', translation: 'rửa tay', category: 'body', difficulty: 'easy', phonetic: '/wɑːʃ hændz/', example: 'Please wash your hands before eating.', type: 'phrase' },
  { word: 'brush teeth', translation: 'đánh răng', category: 'body', difficulty: 'easy', phonetic: '/brʌʃ tiːθ/', example: 'I brush my teeth every morning.', type: 'phrase' },
  { word: 'close eyes', translation: 'nhắm mắt', category: 'body', difficulty: 'easy', phonetic: '/kloʊz aɪz/', example: 'Close your eyes and make a wish.', type: 'phrase' },
  { word: 'My head hurts', translation: 'Đầu tôi đau', category: 'body', difficulty: 'easy', phonetic: '/maɪ hed hɜːrts/', example: 'My head hurts after studying.', type: 'sentence' },
  { word: 'I have two hands', translation: 'Tôi có hai bàn tay', category: 'body', difficulty: 'easy', phonetic: '/aɪ hæv tuː hændz/', example: 'I have two hands and ten fingers.', type: 'sentence' },

  // Business Phrases & Sentences
  { word: 'business meeting', translation: 'cuộc họp kinh doanh', category: 'business', difficulty: 'hard', phonetic: '/ˈbɪznəs ˈmiːtɪŋ/', example: 'We have a business meeting at 2 PM.', type: 'phrase' },
  { word: 'make money', translation: 'kiếm tiền', category: 'business', difficulty: 'medium', phonetic: '/meɪk ˈmʌni/', example: 'He works hard to make money.', type: 'phrase' },
  { word: 'good business', translation: 'kinh doanh tốt', category: 'business', difficulty: 'medium', phonetic: '/ɡʊd ˈbɪznəs/', example: 'This is a good business opportunity.', type: 'phrase' },
  { word: 'Business is good', translation: 'Kinh doanh đang tốt', category: 'business', difficulty: 'medium', phonetic: '/ˈbɪznəs ɪz ɡʊd/', example: 'Business is good this year.', type: 'sentence' },
  { word: 'I work in business', translation: 'Tôi làm việc trong lĩnh vực kinh doanh', category: 'business', difficulty: 'hard', phonetic: '/aɪ wɜːrk ɪn ˈbɪznəs/', example: 'I work in business development.', type: 'sentence' },

  // Clothes Phrases & Sentences
  { word: 'new clothes', translation: 'quần áo mới', category: 'clothes', difficulty: 'easy', phonetic: '/nuː kloʊðz/', example: 'I bought new clothes yesterday.', type: 'phrase' },
  { word: 'wear clothes', translation: 'mặc quần áo', category: 'clothes', difficulty: 'easy', phonetic: '/wer kloʊðz/', example: 'I wear different clothes every day.', type: 'phrase' },
  { word: 'beautiful dress', translation: 'chiếc váy đẹp', category: 'clothes', difficulty: 'medium', phonetic: '/ˈbjuːtɪfəl dres/', example: 'She is wearing a beautiful dress.', type: 'phrase' },
  { word: 'I like your shirt', translation: 'Tôi thích áo sơ mi của bạn', category: 'clothes', difficulty: 'medium', phonetic: '/aɪ laɪk jʊr ʃɜːrt/', example: 'I like your shirt, where did you buy it?', type: 'sentence' },
  { word: 'These shoes are comfortable', translation: 'Đôi giày này rất thoải mái', category: 'clothes', difficulty: 'medium', phonetic: '/ðiːz ʃuːz ɑːr ˈkʌmftəbəl/', example: 'These shoes are comfortable for walking.', type: 'sentence' },

  // Colors Phrases & Sentences
  { word: 'bright red', translation: 'màu đỏ tươi', category: 'colors', difficulty: 'medium', phonetic: '/braɪt red/', example: 'She is wearing a bright red dress.', type: 'phrase' },
  { word: 'dark blue', translation: 'màu xanh đậm', category: 'colors', difficulty: 'medium', phonetic: '/dɑːrk bluː/', example: 'I prefer dark blue jeans.', type: 'phrase' },
  { word: 'light green', translation: 'màu xanh nhạt', category: 'colors', difficulty: 'medium', phonetic: '/laɪt ɡriːn/', example: 'The walls are painted light green.', type: 'phrase' },
  { word: 'What color is it', translation: 'Nó màu gì', category: 'colors', difficulty: 'easy', phonetic: '/wʌt ˈkʌlər ɪz ɪt/', example: 'What color is your favorite shirt?', type: 'sentence' },
  { word: 'I love this color', translation: 'Tôi thích màu này', category: 'colors', difficulty: 'easy', phonetic: '/aɪ lʌv ðɪs ˈkʌlər/', example: 'I love this color, it\'s so beautiful.', type: 'sentence' },

  // === ADDING VOCABULARY FOR MISSING CATEGORIES (21, 27, 32, 33, 34) ===

  // Music (Âm nhạc) - Category for position 21
  { word: 'song', translation: 'bài hát', category: 'music', difficulty: 'easy', phonetic: '/sɔːŋ/', example: 'I love this song.' },
  { word: 'sing', translation: 'hát', category: 'music', difficulty: 'easy', phonetic: '/sɪŋ/', example: 'She can sing very well.' },
  { word: 'dance', translation: 'nhảy', category: 'music', difficulty: 'easy', phonetic: '/dæns/', example: 'Let\'s dance together.' },
  { word: 'music', translation: 'âm nhạc', category: 'music', difficulty: 'easy', phonetic: '/ˈmjuːzɪk/', example: 'I listen to music every day.' },
  { word: 'guitar', translation: 'đàn guitar', category: 'music', difficulty: 'medium', phonetic: '/ɡɪˈtɑːr/', example: 'He plays the guitar beautifully.' },
  { word: 'piano', translation: 'đàn piano', category: 'music', difficulty: 'medium', phonetic: '/piˈænoʊ/', example: 'She is learning to play piano.' },

  // Travel (Du lịch) - Category for position 27
  { word: 'travel', translation: 'du lịch', category: 'travel', difficulty: 'medium', phonetic: '/ˈtrævəl/', example: 'I love to travel around the world.' },
  { word: 'vacation', translation: 'kỳ nghỉ', category: 'travel', difficulty: 'medium', phonetic: '/veɪˈkeɪʃən/', example: 'We are going on vacation next week.' },
  { word: 'hotel', translation: 'khách sạn', category: 'travel', difficulty: 'medium', phonetic: '/hoʊˈtel/', example: 'We stayed at a nice hotel.' },
  { word: 'airport', translation: 'sân bay', category: 'travel', difficulty: 'medium', phonetic: '/ˈerpɔːrt/', example: 'I will pick you up at the airport.' },
  { word: 'passport', translation: 'hộ chiếu', category: 'travel', difficulty: 'hard', phonetic: '/ˈpæspɔːrt/', example: 'Don\'t forget your passport.' },
  { word: 'suitcase', translation: 'vali', category: 'travel', difficulty: 'medium', phonetic: '/ˈsuːtkeɪs/', example: 'Pack your suitcase for the trip.' },

  // Nature (Thiên nhiên) - Category for position 32
  { word: 'tree', translation: 'cây', category: 'nature', difficulty: 'easy', phonetic: '/triː/', example: 'The tree is very tall.' },
  { word: 'flower', translation: 'hoa', category: 'nature', difficulty: 'easy', phonetic: '/ˈflaʊər/', example: 'The flower smells beautiful.' },
  { word: 'mountain', translation: 'núi', category: 'nature', difficulty: 'medium', phonetic: '/ˈmaʊntən/', example: 'We climbed the mountain yesterday.' },
  { word: 'river', translation: 'sông', category: 'nature', difficulty: 'easy', phonetic: '/ˈrɪvər/', example: 'The river flows to the sea.' },
  { word: 'forest', translation: 'rừng', category: 'nature', difficulty: 'medium', phonetic: '/ˈfɔːrəst/', example: 'Many animals live in the forest.' },
  { word: 'ocean', translation: 'đại dương', category: 'nature', difficulty: 'medium', phonetic: '/ˈoʊʃən/', example: 'The ocean is very deep.' },

  // Hobbies (Sở thích) - Category for position 33
  { word: 'hobby', translation: 'sở thích', category: 'hobbies', difficulty: 'medium', phonetic: '/ˈhɑːbi/', example: 'Reading is my favorite hobby.' },
  { word: 'reading', translation: 'đọc sách', category: 'hobbies', difficulty: 'easy', phonetic: '/ˈriːdɪŋ/', example: 'I enjoy reading novels.' },
  { word: 'cooking', translation: 'nấu ăn', category: 'hobbies', difficulty: 'medium', phonetic: '/ˈkʊkɪŋ/', example: 'Cooking is fun and relaxing.' },
  { word: 'painting', translation: 'vẽ tranh', category: 'hobbies', difficulty: 'medium', phonetic: '/ˈpeɪntɪŋ/', example: 'She loves painting landscapes.' },
  { word: 'gardening', translation: 'làm vườn', category: 'hobbies', difficulty: 'hard', phonetic: '/ˈɡɑːrdənɪŋ/', example: 'Gardening helps me relax.' },
  { word: 'photography', translation: 'chụp ảnh', category: 'hobbies', difficulty: 'hard', phonetic: '/fəˈtɑːɡrəfi/', example: 'Photography is an expensive hobby.' },

  // Money (Tiền bạc) - Category for position 34
  { word: 'money', translation: 'tiền', category: 'money', difficulty: 'easy', phonetic: '/ˈmʌni/', example: 'I need money to buy food.' },
  { word: 'dollar', translation: 'đô la', category: 'money', difficulty: 'easy', phonetic: '/ˈdɑːlər/', example: 'This costs ten dollars.' },
  { word: 'bank', translation: 'ngân hàng', category: 'money', difficulty: 'medium', phonetic: '/bæŋk/', example: 'I need to go to the bank.' },
  { word: 'save', translation: 'tiết kiệm', category: 'money', difficulty: 'medium', phonetic: '/seɪv/', example: 'I save money every month.' },
  { word: 'spend', translation: 'tiêu tiền', category: 'money', difficulty: 'easy', phonetic: '/spend/', example: 'Don\'t spend too much money.' },
  { word: 'credit card', translation: 'thẻ tín dụng', category: 'money', difficulty: 'hard', phonetic: '/ˈkredɪt kɑːrd/', example: 'I pay with my credit card.', type: 'phrase' }
];
async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data
    await prisma.practice.deleteMany();
    await prisma.reviewItem.deleteMany();
    await prisma.quizSession.deleteMany();
    await prisma.vocabulary.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Seed vocabulary
    for (const vocab of vocabularyData) {
      await prisma.vocabulary.upsert({
        where: { word: vocab.word },
        update: vocab,
        create: vocab
      });
    }

    console.log(`✅ Created ${vocabularyData.length} vocabulary words`);

    // Create a demo user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 12);
    
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        password: hashedPassword,
        name: 'Demo Student',
        role: 'student'
      }
    });

    console.log('👤 Created demo user: demo@example.com (password: 123456)');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'System Administrator',
        role: 'admin'
      }
    });

    console.log('👑 Created admin user: admin@example.com (password: admin123)');

    // Create some sample practice records with different modes
    const sampleVocab = await prisma.vocabulary.findMany({ take: 20 });
    const modes = ['practice', 'quiz', 'review'];
    
    // Create some quiz sessions first
    const quizSession1 = await prisma.quizSession.create({
      data: {
        userId: demoUser.id,
        title: 'Animals Quiz - 8 Questions',
        category: 'animals',
        difficulty: 'easy',
        totalScore: 680,
        maxScore: 800,
        timeLimit: 8,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    });

    const quizSession2 = await prisma.quizSession.create({
      data: {
        userId: demoUser.id,
        title: 'Colors & Numbers Quiz - 6 Questions',
        category: 'colors',
        difficulty: 'medium',
        totalScore: 480,
        maxScore: 600,
        timeLimit: 6,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    });

    const quizSession3 = await prisma.quizSession.create({
      data: {
        userId: demoUser.id,
        title: 'Greetings & Phrases Quiz - 10 Questions',
        category: 'greetings',
        difficulty: 'hard',
        totalScore: 850,
        maxScore: 1000,
        timeLimit: 10,
        completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      }
    });
    
    // Create practice records
    for (let i = 0; i < 50; i++) {
      const randomVocab = sampleVocab[Math.floor(Math.random() * sampleVocab.length)];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
      
      // Assign some practices to quiz sessions
      let quizSessionId = null;
      if (randomMode === 'quiz' && i < 24) {
        if (i < 8) quizSessionId = quizSession1.id;
        else if (i < 14) quizSessionId = quizSession2.id;
        else quizSessionId = quizSession3.id;
      }
      
      await prisma.practice.create({
        data: {
          userId: demoUser.id,
          vocabularyId: randomVocab.id,
          transcription: randomVocab.word.toLowerCase(),
          score: score,
          feedback: score > 85 ? 'Xuất sắc! Phát âm hoàn hảo!' : 
                   score > 75 ? 'Tuyệt vời! Bạn phát âm rất tốt!' : 
                   'Tốt lắm! Hãy tiếp tục luyện tập nhé!',
          isCorrect: score > 75,
          mode: randomMode,
          quizSessionId: quizSessionId,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
        }
      });
    }

    // Create some review items for words that need practice
    const reviewVocab = await prisma.vocabulary.findMany({ 
      where: { difficulty: { in: ['medium', 'hard'] } },
      take: 15 
    });

    for (const vocab of reviewVocab) {
      await prisma.reviewItem.create({
        data: {
          userId: demoUser.id,
          vocabularyId: vocab.id,
          lastScore: Math.floor(Math.random() * 30) + 60, // 60-90
          attempts: Math.floor(Math.random() * 5) + 1, // 1-5 attempts
          needsReview: Math.random() > 0.3, // 70% need review
          createdAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) // Random date within last 5 days
        }
      });
    }

    console.log('📊 Created sample practice records and review items');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   • ${vocabularyData.length} vocabulary words (từ đơn, cụm từ, câu)`);
    console.log(`   • Các chủ đề: animals, colors, numbers, food, family, body, school, weather, transport, home, clothes, sports, greetings, questions, emotions, daily activities, và nhiều hơn nữa`);
    console.log(`   • Độ khó: easy (dễ), medium (trung bình), hard (khó)`);
    console.log(`   • Loại: word (từ đơn), phrase (cụm từ), sentence (câu)`);
    console.log(`   • 1 demo user (demo@example.com)`);
    console.log(`   • 1 admin user (admin@example.com)`);
    console.log(`   • 3 sample quiz sessions`);
    console.log(`   • 50 sample practice records`);
    console.log(`   • 15 review items for challenging words`);
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });