export function generateName(country, gender){
    const keyPrefix = `${country}_names_${gender}`;
    const names = namesData[keyPrefix];
    const surnames = namesData[`${country}_surnames`];
  
    if(!names || names.length == 0){
        return "";
    }
  
    let randomIndex = Math.floor(Math.random() * names.length);
    const name = names[randomIndex];

    randomIndex = Math.floor(Math.random() * surnames.length);
    const surname = surnames[randomIndex];

    return name + " " + surname;
}

const famousSurnames = {
    'IT_famous_surnames': ['Ascari', 'Nuvolari', 'Varzi', 'Farina'],
    'DE_famous_surnames': ['Schumacher', 'Vettel', 'Rosberg', ''],
    'GB_famous_surnames': ['Hill', 'Stewart', 'Hamilton', 'Moss'],
    'BR_famous_surnames': ['Senna', 'Fittipaldi', 'Piquet', 'Barrichello'],
    'AU_famous_surnames': ['Brabham', 'Jones', 'Webber', 'Brock'],
    'FR_famous_surnames': ['Prost', 'Pironi', 'Laffite', 'Arnoux'],
    'AT_famous_surnames': ['Lauda'],
    'US_famous_surnames': ['Andretti'],
    'ZA_famous_surnames': ['Scheckter'],
}

const namesData = {
    'IT_names_male': ['Luca', 'Alessandro', 'Lorenzo', 'Matteo', 'Marco', 'Giovanni', 'Riccardo', 'Davide', 'Federico', 'Andrea', 'Francesco', 'Giuseppe', 'Roberto', 'Stefano'],
    'IT_names_female': ['Giulia', 'Francesca', 'Sofia', 'Elena', 'Alessia', 'Alice'],
    'IT_surnames': ['Rossi', 'Ferrari', 'Moretti', 'Ricci', 'Conti', 'De Luca', 'Marini', 'Mancini', 'Greco', 'Bruno'],
  
    'DE_names_male': ['Lukas', 'Maximilian', 'Leon', 'Paul', 'Felix', 'Benjamin', 'Nico', 'Jonas', 'Alexander', 'Julian', 'Tim'],
    'DE_names_female': ['Anna', 'Sophie', 'Emma', 'Laura', 'Hannah', 'Isabella', 'Mia'],
    'DE_surnames': ['Schmidt', 'Schneider', 'Müller', 'Fischer', 'Weber', 'Wagner', 'Schulz', 'Becker', 'Hoffmann', 'Koch'],
  
    'GB_names_male': ['Oliver', 'Jack', 'Harry', 'George', 'William', 'Charlie', 'Thomas', 'James', 'Daniel', 'Samuel'],
    'GB_names_female': ['Charlotte', 'Sophia', 'Amelia', 'Emily', 'Poppy', 'Jessica', 'Ellie'],
    'GB_surnames': ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Patel', 'Harrison', 'Evans', 'Turner'],
  
    'BR_names_male': ['Gabriel', 'Lucas', 'Enzo', 'Pedro', 'Matheus', 'João', 'Guilherme', 'Luiz', 'Felipe', 'Rafael', 'Thiago', 'Gustavo'],
    'BR_names_female': ['Mariana', 'Isabella', 'Ana Clara', 'Beatriz', 'Laura', 'Larissa', 'Giovanna'],
    'BR_surnames': ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Ferreira', 'Rodrigues', 'Almeida', 'Nascimento'],
  
    'AU_names_male': ['Oliver', 'Lucas', 'William', 'Ethan', 'James', 'Liam', 'Jack', 'Noah', 'Charlie', 'Thomas', 'Jackson'],
    'AU_names_female': ['Olivia', 'Ava', 'Charlotte', 'Mia', 'Sophia', 'Grace'],
    'AU_surnames': ['Smith', 'Jones', 'Brown', 'Wilson', 'Patel', 'Taylor', 'Lee', 'Wang', 'Chen', 'Kim'],
  
    'FR_names_male': ['Lucas', 'Adam', 'Raphaël', 'Jules', 'Arthur', 'Nathan', 'Hugo', 'Louis', 'Gabriel', 'Léo', 'Ethan'],
    'FR_names_female': ['Léa', 'Chloé', 'Emma', 'Inès', 'Lola', 'Manon', 'Louise', 'Camille'],
    'FR_surnames': ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Lefevre'],
  
    'AT_names_male': ['Jakob', 'David', 'Maximilian', 'Lukas', 'Elias', 'Paul', 'Simon', 'Alexander'],
    'AT_names_female': ['Lena', 'Sophie', 'Anna', 'Laura', 'Emma', 'Maria', 'Julia'],
    'AT_surnames': ['Gruber', 'Wagner', 'Huber', 'Müller', 'Steiner', 'Mayr', 'Bauer', 'Schmidt', 'Hofer', 'Fischer'],
  
    'FI_names_male': ['Onni', 'Elias', 'Väinö', 'Oliver', 'Leo', 'Noah', 'Matias', 'Nikolai'],
    'FI_names_female': ['Aada', 'Emma', 'Sofia', 'Lilja', 'Lotte', 'Eveliina'],
    'FI_surnames': ['Virtanen', 'Mäkinen', 'Laine', 'Korhonen', 'Lehtonen', 'Heikkinen', 'Koskinen', 'Järvinen', 'Nieminen', 'Hämäläinen'],
  
    'US_names_male': ['Liam', 'Noah', 'Aiden', 'Lucas', 'Ethan', 'Jackson', 'Logan', 'Mason'],
    'US_names_female': ['Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Amelia'],
    'US_surnames': ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Miller', 'Davis', 'García', 'Rodriguez', 'Martinez'],
  
    'NL_names_male': ['Daan', 'Lucas', 'Levi', 'Sem', 'Finn', 'Noah', 'Luuk', 'Mees'],
    'NL_names_female': ['Anna', 'Lotte', 'Lynn', 'Eva'],
    'NL_surnames': ['de Jong', 'Jansen', 'de Vries', 'van den Berg', 'Bakker', 'Smit', 'Meijer', 'van der Laan', 'de Boer', 'Visser'],

    'ES_names_male': ['Pablo', 'Alejandro', 'Daniel', 'David', 'Javier', 'Adrián', 'Sergio', 'Álvaro'],
    'ES_names_female': ['Lucía', 'Sofía', 'Martina', 'Paula', 'Valeria', 'Daniela', 'Alba', 'Emma'],
    'ES_surnames': ['García', 'Rodríguez', 'Martínez', 'Fernández', 'López', 'Gómez', 'Sánchez', 'Pérez', 'Díaz', 'Torres'],
  
    'BE_names_male': ['Liam', 'Noah', 'Lucas', 'Finn', 'Louis', 'Victor', 'Maxime', 'Gabriel'],
    'BE_names_female': ['Emma', 'Lotte', 'Eva', 'Sophie', 'Anna', 'Julia', 'Amélie', 'Nina'],
    'BE_surnames': ['Dubois', 'Lambert', 'Martens', 'Dupont', 'Leroy', 'Janssens', 'Maes', 'De Smet', 'Lefevre', 'Wouters'],
  
    'CA_names_male': ['Liam', 'Noah', 'Lucas', 'Ethan', 'Logan', 'Alexander', 'William', 'Benjamin'],
    'CA_names_female': ['Emma', 'Olivia', 'Ava', 'Sophia', 'Isabella', 'Emily', 'Mia', 'Grace'],
    'CA_surnames': ['Smith', 'Johnson', 'Williams', 'Brown', 'Taylor', 'Chen', 'Lee', 'Singh', 'Wong', 'Wu'],
  
    'SE_names_male': ['Liam', 'Oliver', 'Lucas', 'Alexander', 'William', 'Oscar', 'Noah', 'Elias'],
    'SE_names_female': ['Ella', 'Maja', 'Astrid', 'Alma', 'Julia', 'Isabella', 'Emma', 'Elin'],
    'SE_surnames': ['Andersson', 'Johansson', 'Larsson', 'Karlsson', 'Eriksson', 'Persson', 'Nilsson', 'Svensson', 'Gustafsson', 'Olofsson'],
  
    'AR_names_male': ['Mateo', 'Thiago', 'Santino', 'Bautista', 'Benicio', 'Emilio', 'Alejo', 'León'],
    'AR_names_female': ['Sofía', 'Valentina', 'Emma', 'Martina', 'Renata', 'Isabella', 'Victoria', 'Luciana'],
    'AR_surnames': ['González', 'Rodríguez', 'López', 'Gómez', 'Fernández', 'Martínez', 'Sánchez', 'Pérez', 'Díaz', 'Romero'],
  
    'MX_names_male': ['Santiago', 'Mateo', 'Matías', 'Leonardo', 'Emiliano', 'Diego', 'Daniel', 'Sebastián'],
    'MX_names_female': ['Mia', 'Sofía', 'Valentina', 'Renata', 'Isabella', 'Emma', 'Camila', 'Victoria'],
    'MX_surnames': ['Hernández', 'García', 'Martínez', 'López', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Torres'],
    
    'RU_names_male': ['Ivan', 'Dmitri', 'Mikhail', 'Artem', 'Nikita', 'Alexei', 'Andrei', 'Maxim'],
    'RU_names_female': ['Anna', 'Maria', 'Ekaterina', 'Sofia', 'Daria', 'Polina', 'Yulia', 'Anastasia'],
    'RU_surnames': ['Ivanov', 'Smirnov', 'Kuznetsov', 'Popov', 'Sokolov', 'Lebedev', 'Kozlov', 'Novikov', 'Morozov', 'Petrov'],
  
    'JP_names_male': ['Haruto', 'Ryota', 'Yuto', 'Kaito', 'Sota', 'Ren', 'Hinata', 'Kota'],
    'JP_names_female': ['Yui', 'Aoi', 'Rio', 'Hana', 'Sakura', 'Yuna', 'Koharu', 'Mio'],
    'JP_surnames': ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato'],
  
    'CN_names_male': ['Hao', 'Yi', 'Chen', 'Wei', 'Lei', 'Jun', 'Tao', 'Xin'],
    'CN_names_female': ['Li', 'Zhang', 'Wang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhu'],
    'CN_surnames': ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Zhu', 'Xu'],
  
    'IN_names_male': ['Aarav', 'Arjun', 'Rohan', 'Aditya', 'Aryan', 'Varun', 'Vikram', 'Raj'],
    'IN_names_female': ['Aanya', 'Ishita', 'Anika', 'Dia', 'Pari', 'Aisha', 'Riya', 'Meera'],
    'IN_surnames': ['Patel', 'Sharma', 'Gupta', 'Singh', 'Kumar', 'Shah', 'Yadav', 'Choudhury', 'Nair', 'Verma'],
  
    'ZA_names_male': ['Liam', 'Ethan', 'Joshua', 'Aiden', 'Daniel', 'Jayden', 'Jordan', 'Cameron'],
    'ZA_names_female': ['Olivia', 'Chloe', 'Emma', 'Leah', 'Zoe', 'Sophia', 'Ava', 'Mia'],
    'ZA_surnames': ['Nkosi', 'Mabaso', 'Van der Merwe', 'Sithole', 'Lubisi', 'Molefe', 'Vilakazi', 'Zulu', 'Botha', 'Mkhize'],
  
    'PL_names_male': ['Jakub', 'Kacper', 'Michał', 'Mateusz', 'Bartosz', 'Adam', 'Piotr', 'Szymon'],
    'PL_names_female': ['Julia', 'Zuzanna', 'Maja', 'Lena', 'Natalia', 'Wiktoria', 'Oliwia', 'Amelia'],
    'PL_surnames': ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak'],
  
    'HU_names_male': ['Bence', 'Ádám', 'Máté', 'Dávid', 'Levente', 'Péter', 'Zoltán', 'Gergő'],
    'HU_names_female': ['Anna', 'Emma', 'Laura', 'Lili', 'Zsófia', 'Hanna', 'Evelin', 'Katalin'],
    'HU_surnames': ['Nagy', 'Kovács', 'Szabó', 'Kiss', 'Tóth', 'Horváth', 'Varga', 'Balogh', 'Molnár', 'Farkas'],
  
    'CO_names_male': ['Santiago', 'Sebastián', 'Matías', 'Alejandro', 'Mateo', 'Juan', 'Nicolás', 'Samuel'],
    'CO_names_female': ['Valentina', 'Sofía', 'Isabella', 'Mariana', 'Camila', 'Lucía', 'Emma', 'Daniela'],

    'CO_surnames': ['Gómez', 'Rodríguez', 'Martínez', 'Fernández', 'López', 'Gutiérrez', 'Díaz', 'Sánchez', 'Ramírez', 'Pérez'],

    'PT_names_male': ['Miguel', 'Tiago', 'João', 'Pedro', 'André', 'Rafael', 'Diogo', 'Daniel'],
    'PT_names_female': ['Maria', 'Ana', 'Mariana', 'Sofia', 'Inês', 'Matilde', 'Leonor', 'Beatriz'],
    'PT_surnames': ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Costa', 'Fernandes', 'Martins', 'Gonçalves', 'Rodrigues', 'Lopes'],

    'SG_names_male': ['Kai', 'Ethan', 'Zachary', 'Ryan', 'Evan', 'Isaac', 'Adam', 'Asher'],
    'SG_names_female': ['Chloe', 'Emily', 'Sophia', 'Zoe', 'Mia', 'Ella', 'Ava', 'Olivia'],
    'SG_surnames': ['Lim', 'Tan', 'Ng', 'Ong', 'Chua', 'Koh', 'Teo', 'Cheong', 'Soh', 'Sim'],

    'TR_names_male': ['Eren', 'Emir', 'Oğuz', 'Burak', 'Kaan', 'Can', 'Arda', 'Alp'],
    'TR_names_female': ['Elif', 'Zeynep', 'Ceren', 'Melis', 'Defne', 'İlayda', 'Lina', 'Aylin'],
    'TR_surnames': ['Yılmaz', 'Demir', 'Kaya', 'Çelik', 'Yıldız', 'Şahin', 'Aydın', 'Koç', 'Yıldırım', 'Erdoğan'],

    'GR_names_male': ['Dimitris', 'Giannis', 'Nikos', 'Costas', 'Panos', 'Yiannis', 'Antonis', 'Takis'],
    'GR_names_female': ['Maria', 'Eleni', 'Sofia', 'Anna', 'Katerina', 'Despina', 'Ioanna', 'Niki'],
    'GR_surnames': ['Papadopoulos', 'Giannopoulos', 'Papadakis', 'Nikolaidis', 'Kouros', 'Karagiannis', 'Ioannou', 'Antoniou', 'Georgiou'],

    'CZ_names_male': ['Jakub', 'Adam', 'Matěj', 'Tomáš', 'Lukáš', 'Petr', 'Jan', 'Martin'],
    'CZ_names_female': ['Eva', 'Anna', 'Tereza', 'Lucie', 'Karolína', 'Veronika', 'Klára', 'Petra'],
    'CZ_surnames': ['Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák', 'Němec'],

    'KR_names_male': ['Seung', 'Joon', 'Min', 'Sung', 'Ji', 'Hyun', 'Ho', 'Woo'],
    'KR_names_female': ['Yeon', 'Eun', 'Hye', 'Soo', 'Min', 'Ji', 'Jiyeon', 'Ha'],
    'KR_surnames': ['Kim', 'Lee', 'Park', 'Choi', 'Jeong', 'Cho', 'Yoon', 'Kang', 'Yoo', 'Shin'],

    'ID_names_male': ['Ari', 'Dika', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Irfan', 'Joko'],
    'ID_names_female': ['Anisa', 'Dewi', 'Citra', 'Eka', 'Fitri', 'Gita', 'Hana', 'Indah'],
    'ID_surnames': ['Santoso', 'Hidayat', 'Pratama', 'Wijaya', 'Saputra', 'Nugroho', 'Kusuma', 'Yulianto', 'Putra', 'Setiawan'],

    'TH_names_male': ['Napat', 'Tawan', 'Thana', 'Phanuwat', 'Kittisak', 'Voravit', 'Arthit', 'Nawin'],
    'TH_names_female': ['Supaporn', 'Wanida', 'Achara', 'Kanyarat', 'Kamala', 'Naree', 'Jiraporn', 'Saranya'],
    'TH_surnames': ['Sornchai', 'Wongsa', 'Chaiyaporn', 'Phromsiri', 'Srisuk', 'Chuaydee', 'Suwan', 'Nuanjam', 'Kittipong', 'Namwong'],

    'AE_names_male': ['Ahmed', 'Mohammed', 'Khalid', 'Sultan', 'Omar', 'Abdullah', 'Faisal', 'Nasser'],
    'AE_names_female': ['Fatima', 'Aisha', 'Mariam', 'Layla', 'Sara', 'Hind', 'Noor', 'Latifa'],
    'AE_surnames': ['Al-Mansoori', 'Al-Farsi', 'Al-Suwaidi', 'Al-Hosani', 'Al-Kaabi', 'Al-Qasimi', 'Al-Mazrouei', 'Al-Dhaheri', 'Al-Ali', 'Al-Blooshi'],

    'EG_names_male': ['Ahmed', 'Mohamed', 'Omar', 'Ali', 'Youssef', 'Amr', 'Karim', 'Tarek'],
    'EG_names_female': ['Fatma', 'Aya', 'Nour', 'Sara', 'Hana', 'Mariam', 'Yasmine', 'Dina'],
    'EG_surnames': ['Mohamed', 'Abdel-Maksoud', 'Abdel-Rahman', 'Abdel-Aziz', 'Ali', 'Hassan', 'Mahmoud', 'El-Din', 'Ibrahim', 'Abdallah'],
    
    'RO_names_male': ['Andrei', 'Mihai', 'Gabriel', 'Alexandru', 'Cristian', 'Adrian', 'Bogdan', 'Ionut'],
    'RO_names_female': ['Ana', 'Maria', 'Elena', 'Ioana', 'Andreea', 'Alexandra', 'Diana', 'Raluca'],
    'RO_surnames': ['Popescu', 'Ionescu', 'Popa', 'Dumitru', 'Stoica', 'Constantin', 'Radu', 'Georgescu', 'Munteanu', 'Gheorghe'],

    'UA_names_male': ['Oleksandr', 'Ivan', 'Andrii', 'Mykola', 'Yurii', 'Oleh', 'Dmytro', 'Roman'],
    'UA_names_female': ['Olena', 'Anna', 'Yuliia', 'Kateryna', 'Nataliia', 'Olga', 'Tetiana', 'Iryna'],
    'UA_surnames': ['Kovalenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Makarenko', 'Yakovenko', 'Kozlov', 'Polishchuk', 'Kozak', 'Petrov'],

    'CL_names_male': ['Mateo', 'Joaquín', 'Tomás', 'Matías', 'Benjamín', 'Lucas', 'Nicolás', 'Sebastián'],
    'CL_names_female': ['Isabella', 'Sofía', 'Emilia', 'Valentina', 'Martina', 'Trinidad', 'Antonia', 'Catalina'],
    'CL_surnames': ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Gómez'],

    'IE_names_male': ['Jack', 'Sean', 'Conor', 'James', 'Daniel', 'Adam', 'Liam', 'Michael'],
    'IE_names_female': ['Emily', 'Sophie', 'Aoife', 'Emma', 'Amelia', 'Olivia', 'Grace', 'Mia'],
    'IE_surnames': ['Murphy', `O'Brien`, 'Kelly', 'Ryan', 'Doherty', 'Walsh', `O'Sullivan`, 'Byrne', 'Doyle', 'Gallagher'],

    'DK_names_male': ['Liam', 'Noah', 'Oliver', 'Elias', 'Frederik', 'Emil', 'Lucas', 'Oscar'],
    'DK_names_female': ['Emma', 'Sofia', 'Isabella', 'Freja', 'Laura', 'Clara', 'Anna', 'Maja'],
    'DK_surnames': ['Andersen', 'Nielsen', 'Hansen', 'Pedersen', 'Jensen', 'Rasmussen', 'Kristensen', 'Olsen', 'Thomsen', 'Mortensen'],

    'NO_names_male': ['Liam', 'Jakob', 'Emil', 'Oskar', 'Oliver', 'Magnus', 'Henrik', 'Thomas'],
    'NO_names_female': ['Emma', 'Nora', 'Sofia', 'Amalie', 'Ingrid', 'Mia', 'Ella', 'Ida'],
    'NO_surnames': ['Hansen', 'Johansen', 'Olsen', 'Larsen', 'Andersen', 'Pedersen', 'Nilsen', 'Kristiansen', 'Karlsen', 'Eriksen'],

    'MY_names_male': ['Muhammad', 'Ahmad', 'Mohd', 'Mohamad', 'Abdul', 'Ismail', 'Kamarul', 'Hafiz'],
    'MY_names_female': ['Nur', 'Aina', 'Siti', 'Nor', 'Azizah', 'Zainab', 'Farah', 'Aisyah'],
    'MY_surnames': ['Mohamed', 'Ismail', 'Abdullah', 'Yusof', 'Ahmad', 'Abdul Rahman', 'Omar', 'Mustafa', 'Ibrahim', 'Mohamad'],

    'PH_names_male': ['John', 'Mark', 'Jayson', 'Michael', 'Jerome', 'Jeffrey', 'Ryan', 'Christian'],
    'PH_names_female': ['Mary', 'Jenelyn', 'Maria', 'Rosalie', 'Michelle', 'Karen', 'Jocelyn', 'Jennifer'],
    'PH_surnames': ['Santos', 'Reyes', 'Cruz', 'Lopez', 'Garcia', 'Mendoza', 'Dela Cruz', 'Torres', 'Aquino', 'Villanueva'],

    'VN_names_male': ['Minh', 'Quang', 'Duc', 'Tuan', 'Hai', 'Nam', 'Khoa', 'Long'],
    'VN_names_female': ['Linh', 'Huong', 'Thi', 'Nga', 'Anh', 'Yen', 'Thu', 'Lan'],
    'VN_surnames': ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Phan', 'Vu', 'Dang', 'Bui', 'Do'],

    'PE_names_male': ['Luis', 'Carlos', 'Juan', 'Jorge', 'José', 'Miguel', 'Antonio', 'Fernando'],
    'PE_names_female': ['Maria', 'Ana', 'Fernanda', 'Sofia', 'Valentina', 'Isabella', 'Lucia', 'Camila'],
    'PE_surnames': ['García', 'Perez', 'Gomez', 'Torres', 'Lopez', 'Castro', 'Rodriguez', 'Soto', 'Flores', 'Chavez'],

    'SA_names_male': ['Mohammed', 'Ahmed', 'Ali', 'Saud', 'Fahad', 'Omar', 'Khalid', 'Abdul'],
    'SA_names_female': ['Fatima', 'Aisha', 'Layla', 'Noura', 'Rana', 'Jasmine', 'Haya', 'Sara'],
    'SA_surnames': ['Al-Saud', 'Al-Maktoum', 'Al-Faisal', 'Al-Rashid', 'Al-Majid', 'Al-Sabah', 'Al-Thani', 'Al-Otaibi', 'Al-Moussa', 'Al-Harbi'],

    'QA_names_male': ['Mohammed', 'Abdullah', 'Hamad', 'Khalifa', 'Jassim', 'Saad', 'Ahmed', 'Salem'],
    'QA_names_female': ['Fatima', 'Aisha', 'Layla', 'Noura', 'Rana', 'Jasmine', 'Haya', 'Sara'],
    'QA_surnames': ['Al-Thani', 'Al-Majid', 'Al-Farsi', 'Al-Kuwari', 'Al-Mohamed', 'Al-Sulaiti', 'Al-Khalaf', 'Al-Abdullah', 'Al-Dosari', 'Al-Hamad'],

    'KW_names_male': ['Ahmed', 'Mohammed', 'Abdul', 'Khalid', 'Fahad', 'Saud', 'Nasser', 'Ali'],
    'KW_names_female': ['Fatima', 'Mariam', 'Aisha', 'Layla', 'Haya', 'Noura', 'Rana', 'Sara'],
    'KW_surnames': ['Al-Sabah', 'Al-Ahmad', 'Al-Mutawa', 'Al-Fadly', 'Al-Rashid', 'Al-Awadi', 'Al-Kandari', 'Al-Dosari', 'Al-Mazidi', 'Al-Saleh'],

    'MA_names_male': ['Mohammed', 'Youssef', 'Omar', 'Hassan', 'Karim', 'Said', 'Abdullah', 'Ibrahim'],
    'MA_names_female': ['Fatima', 'Amina', 'Layla', 'Nora', 'Sofia', 'Hana', 'Salma', 'Leila'],
    'MA_surnames': ['El-Moussaoui', 'El-Mansouri', 'El-Khatib', 'El-Mahjoub', 'El-Hassani', 'El-Hadi', 'El-Bakri', 'El-Arabi', 'El-Amrani', 'El-Mazari'],

    'MC_names_male': ['Antoine', 'Louis', 'Lucas', 'Gabriel', 'Nicolas', 'Pierre', 'Théo', 'Hugo'],
    'MC_names_female': ['Charlotte', 'Emma', 'Alice', 'Léa', 'Juliette', 'Chloé', 'Lola', 'Inès'],
    'MC_surnames': ['Rivière', 'Lefèvre', 'Leroux', 'Lemoine', 'Leclerc', 'Dupont', 'Moreau', 'Martin', 'Lefevre', 'Girard'],

    'EE_names_male': ['Jaan', 'Martin', 'Kristjan', 'Andres', 'Markus', 'Hannes', 'Karl', 'Rasmus'],
    'EE_names_female': ['Liis', 'Kadri', 'Eva', 'Mari', 'Laura', 'Kairi', 'Anu', 'Helena'],
    'EE_surnames': ['Tamm', 'Mägi', 'Kask', 'Rebane', 'Laur', 'Ots', 'Toom', 'Põld', 'Kuusk', 'Saar'],

    'NO_names_male': ['Liam', 'Oliver', 'Emil', 'Oskar', 'Elias', 'Jakob', 'Noah', 'William'],
    'NO_names_female': ['Nora', 'Emma', 'Sofie', 'Ella', 'Ingrid', 'Amelia', 'Leah', 'Maja'],
    'NO_surnames': ['Hansen', 'Johansen', 'Olsen', 'Andersen', 'Pedersen', 'Larsen', 'Sørensen', 'Kristensen', 'Karlsen', 'Eriksen'],

    'CH_names_male': ['Liam', 'Noah', 'Luca', 'Elias', 'Leon', 'Nico', 'David', 'Luis'],
    'CH_names_female': ['Emma', 'Mia', 'Sophie', 'Lara', 'Anna', 'Lina', 'Elena', 'Nina'],
    'CH_surnames': ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Meyer', 'Weber', 'Wagner', 'Schmid', 'Keller', 'Koch'],

    'NZ_names_male': ['Liam', 'Oliver', 'Jack', 'Ethan', 'Mason', 'Noah', 'James', 'Lucas'],
    'NZ_names_female': ['Olivia', 'Charlotte', 'Isla', 'Amelia', 'Ava', 'Ella', 'Harper', 'Grace'],
    'NZ_surnames': ['Smith', 'Jones', 'Williams', 'Brown', 'Taylor', 'Wilson', 'Anderson', 'Clark', 'Evans', 'Parker'],

    "IL_names_male": ["Eitan", "Itai", "Yosef", "Amitai", "Yonatan", "Oren", "Avi", "Lior"],
    "IL_names_female": ["Shira", "Maya", "Noa", "Tamar", "Yael", "Adi", "Liat", "Yonit"],
    "IL_surnames": ["Levi", "Cohen", "Goldberg", "Stern", "Katz", "Carmi", "Avraham", "Shapira"],

    "NG_names_male": ["Chijioke", "Emeka", "Oluwaseun", "Adewale", "Nkem", "Obi", "Ugo", "Chukwudi"],
    "NG_names_female": ["Chinwe", "Ngozi", "Oluchi", "Adebisi", "Ogechi", "Chiamaka", "Amarachi", "Ezinne"],
    "NG_surnames": ["Okafor", "Nwabueze", "Eze", "Igwe", "Onyekachi", "Okeke", "Orji", "Ugwu"],

    "HR_names_male": ["Ivan", "Mateo", "Luka", "Nikola", "Ante", "Marko", "Josip", "Stjepan"],
    "HR_names_female": ["Ana", "Elena", "Martina", "Ivana", "Petra", "Lucija", "Katarina", "Mia"],
    "HR_surnames": ["Horvat", "Kovač", "Babić", "Vuković", "Knežević", "Pavić", "Tomljanović", "Jurić"],

    "SI_names_male": ["Luka", "Matej", "Jan", "Žan", "Nejc", "Borut", "Gregor", "Miha"],
    "SI_names_female": ["Ana", "Eva", "Maja", "Nina", "Sara", "Tjaša", "Kaja", "Lara"],
    "SI_surnames": ["Novak", "Kovač", "Zupan", "Mlakar", "Petrovič", "Krajnc", "Kolar", "Hribar"],

    "SK_names_male": ["Martin", "Jakub", "Marek", "Lukáš", "Tomáš", "Peter", "Ján", "Michal"],
    "SK_names_female": ["Eva", "Zuzana", "Katarína", "Lucia", "Veronika", "Mária", "Jana", "Simona"],
    "SK_surnames": ["Novák", "Horváth", "Kováč", "Tóth", "Varga", "Molnár", "Nagy", "Balogh"],

    "RS_names_male": ["Nikola", "Marko", "Stefan", "Jovan", "Aleksandar", "Vuk", "Luka", "Nemanja"],
    "RS_names_female": ["Ana", "Jovana", "Milica", "Ivana", "Teodora", "Maja", "Katarina", "Tamara"],
    "RS_surnames": ["Jovanović", "Popović", "Stojanović", "Nikolić", "Milosavljević", "Ilić", "Petrović", "Dmitrović"],

    "LT_names_male": ["Lukas", "Jonas", "Andrius", "Mantas", "Tomas", "Darius", "Arūnas", "Edgaras"],
    "LT_names_female": ["Gabija", "Jurgita", "Laura", "Rūpinta", "Gintarė", "Indrė", "Aistė", "Simona"],
    "LT_surnames": ["Kazlauskas", "Jankauskas", "Petrauskas", "Sakalauskas", "Kučinskas", "Žukauskas", "Dapkus", "Mikalauskas"],

    "LV_names_male": ["Jānis", "Mārtiņš", "Andris", "Artūrs", "Edgars", "Raimonds", "Kristaps", "Rinalds"],
    "LV_names_female": ["Līga", "Aija", "Zane", "Inese", "Ilze", "Baiba", "Dace", "Santa"],
    "LV_surnames": ["Saulītis", "Ozoliņš", "Bērziņš", "Kalniņš", "Lazdiņš", "Jansons", "Petrovs", "Melderis"],

    "BG_names_male": ["Dimitar", "Ivan", "Georgi", "Stoyan", "Nikolay", "Petar", "Vladimir", "Yordan"],
    "BG_names_female": ["Maria", "Elena", "Anna", "Nina", "Victoria", "Simona", "Alexandra", "Nadezhda"],
    "BG_surnames": ["Ivanov", "Petrov", "Dimitrov", "Georgiev", "Stoyanov", "Nikolov", "Vladimirov", "Kovachev"],

    "LU_names_male": ["Lucas", "Mathias", "Felix", "Sebastian", "Hugo", "Maxime", "Gabriel", "Oliver"],
    "LU_names_female": ["Sophie", "Emma", "Léa", "Amélie", "Anna", "Lara", "Charlotte", "Chloé"],
    "LU_surnames": ["Schmit", "Meyer", "Schroeder", "Weber", "Wagner", "Bernard", "Dupont", "Lambert"]
};