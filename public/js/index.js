      // Definición de las preguntas y ejercicios
        const exercises = [
            // Ejercicio 1: "Look and read. Put a tick (✔) or a cross (X)"
            {   id: 'exercise-1',
                type: 'tick-cross',
                title: 'Ejercicio 1: Marca con ✔ o ❌',
                questions: [
                    {
                        image: '../img/e1aeroplane.png', // Placeholder para un reloj
                        text: 'Is this a Aeroplane ?.',
                        answer: true
                    },
                    {
                        image: '../img/e1duck.png', // Placeholder para motorbikes
                        text: 'Is this a Duck ?.',
                        answer: true
                    },
                    {
                        image: '../img/e1erase.png', // Placeholder para unos pantalones cortos
                        text: 'Are these rules ?',
                        answer: false
                    },
                    {
                        image: '../img/e1eye.png', // Placeholder para una oreja
                        text: 'Is this a nose.?',
                        answer: false
                    },
                    {
                        image: '../img/e1balloon.png', // Placeholder para limas
                        text: 'Are These balloons.',
                        answer: true
                    },
                    {
                        image: '../img/e1chears.png', // Placeholder para raqueta de tenis
                        text: ' Are These chairs.?',
                        answer: true
                    },
                    {
                        image: '../img/e1dress.png', // Placeholder para raqueta de tenis
                        text: 'Is This a jacket?',
                        answer: false
                    },
                    {
                        image: '../img/e1book.png', // Placeholder para raqueta de tenis
                        text: 'is This a Glasses?',
                        answer: false
                    }
                
                ]
            },          
            {   id: 'exercise-2',  // Ejercicio 2: "Look and read. Write yes or no."
                type: 'yes-no',
                title: 'Ejercicio 2: Responde "yes" o "no"',
                image: '../img/imagen10.png', // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image: '',
                        text: 'The monkey is on the zebra\'s head.',
                        answer: true
                    },
                    {
                        image: '',
                        text: 'The giraffe is playing the guitar.',
                        answer: false
                    },
                    {
                        image: '',
                        text: 'The crocodile has got a cake on its tail.',
                        answer: true
                    },
                    {
                        image: '',
                        text: 'The elephant is holding four balloons.',
                        answer: false
                    },
                    {
                        image: '',
                        text: 'There is a spider on the tree.',
                        answer: true
                    },
                    {
                        image: '',
                        text: 'The bird has got a flower in its mouth.',
                        answer: true
                    },
                    {
                        image: '',
                        text: 'The watermelon is between the bananas and the pineapple.',
                        answer: false
                    }
                ]
            },
            {   id: 'exercise-3',  //Ver la imagen y escribir el nombre'
                type: 'letter',
                title: 'Ejercicio 3: Ver la imagen y escribir el nombre',
                image: '', // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image:['../img/e3boat.png',''],
                        text: '',
                        answer: 'BOAT'
                    },
                           {
                        image:['../img/e3helicopter.png',''],
                        text: '',
                        answer: 'HELICOPTER'
                    },
                           {
                        image:['../img/e3bike.png',''],
                        text: '',
                        answer: 'BIKE'
                    },
                           {
                        image:['../img/e3plane.png',''],
                        text: '',
                        answer: 'PLANE'
                    },
                           {
                        image:['../img/e3car.png',''],
                        text: '',
                        answer: 'CAR'
                    },
                           {
                        image:['../img/e3train.png',''],
                        text: '',
                        answer: 'TRAIN'
                    },
                ]
            },
            {   id: 'exercise-4', //Ver la imagen y responder las acciones
                type: 'tick-cross',
                title: 'Ejercicio 4: Es correcto ?',
                image: '', // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image:'../img/e4watch.png',
                        text: 'This is a watch ?',
                        answer: true
                    },{
                        image:'../img/e4bikes.png',
                        text: 'These are motorbikes ?',
                        answer: false
                    },{
                        image:'../img/e4board.png',
                        text: 'This is a board ?',
                        answer: true
                    },{
                        image:'../img/e4tshorts.png',
                        text: 'These are shotrs ?',
                        answer: true
                    },{
                        image:'../img/e4eyes.png',
                        text: 'This is an ear ?',
                        answer: false
                    },{
                        image:'../img/e4apples.png',
                        text: 'These are limes ?',
                        answer: false
                    },{
                        image:'../img/e4tennisracket.png',
                        text: 'This is a tennis racket ?',
                        answer: true
                    }
                ]
            },
            {   id: 'exercise-5', // "Look and read. Write yes or no."
                type: 'yes-no',
                title: 'Ejercicio 5: Responde "yes" o "no"',
                image: '../img/e3livingroom.png',
                questions: [
                    {
                        image:'',
                        text: 'the gril is playing the guitar? ',
                        answer: true
                    },
                     {
                        image:'',
                        text: 'the people are in the garden ?',
                        answer: false
                    },
                     {
                        image:'',
                        text: 'the man has got a book?',
                        answer: true
                    },
                     {
                        image:'',
                        text: 'thera are five flowers on the table? ',
                        answer: false
                    },
                     {
                        image:'',
                        text: 'the baby is sleeping on the table?',
                        answer: false
                    },
                     {
                        image:'',
                        text: 'the cat is on the windows ? ',
                        answer: true
                    },
                     {
                        image:'',
                        text: 'the clock is between the window ',
                        answer: false
                    },
                ]
            }, 
            {   id: 'exercise-6',  //Ver la imagen y escribir el nombre'
                type: 'letter2',
                title: 'Ejercicio 6: Encuentre el Nombre ',
                image: '../img/e5lucybethroom.png', // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image:['../img/e5-bean.png','../img/e5-beanR.png'],
                        text: '',
                        answer: 'bean'
                    },
                           {
                        image:['../img/e5-frise.png','../img/e5-friseR.png'],
                        text: '',
                        answer: 'frise'
                    },
                           {
                        image:['../img/e5-bread.png','../img/e5-breadR.png'],
                        text: '',
                        answer: 'bread'
                    },
                           {
                        image:['../img/e5-grapes.png','../img/e5-grapesR.png'],
                        text: '',
                        answer: 'grapes'
                    },
                           {
                        image:['../img/e5-sausage.png','../img/e5-sausageR.png'],
                        text: '',
                        answer: 'sausage'
                    },
                           {
                        image:['../img/e5-watermelon.png','../img/e5-watermelonR.png'],
                        text: '',
                        answer: 'watermelon'
                    },
                ]
            },
            {   id: 'exercise-7',  //Ver la imagen y escribir el nombre'
                type: 'Textwrite',
                title: 'Ejercicio 7: Compplete el parrafo',
                image: ['../img/E7-myCousinNick.png','../img/e7-mycousinNick2.png'], // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image: '',
                        text: 'This ins my cousin Nick, Nick lives in my street with his mum, dad and two',
                        answer: 'JEANS'
                    },
                    {
                        image:'',
                        text: 'He likes to wear T-shirt and',
                        answer: 'PLAYGROUND'
                    },
                    {
                        image:'',
                        text: 'on our Bikes. Then, we get',
                        answer: 'ICE CREAMS'
                    },
                    {
                        image:'',
                        text: '-Chocolate is our favaurite! In the evening, we wath',
                        answer: 'TELEVISION'
                    },
                    {
                        image:'',
                        text: ' or Talk to our friends on the computer',
                        answer: 'PIANO'
                    },
                    {
                        image:'',
                        text: 'too. We love Music',
                        answer: ''
                    }
                ]
            },
        ];

        let currentExerciseIndex = 0;
        const gameContainer = document.getElementById('game-container');
        const messageBoxContainer = document.getElementById('message-box-container');
        const messageBox = document.getElementById('message-box');

        // Función para renderizar un ejercicio
        function renderExercise(exercise) {
            gameContainer.innerHTML = ''; // Limpiar el contenedor
            let html = '';

            if (exercise.type === 'tick-cross') {
                html = `
                    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            ${exercise.questions.map((q, index) => `
                                <div class="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center game-card" data-index="${index}">
                                    <img src="${q.image}" alt="Ejercicio ${index + 1}" class="question-image rounded-lg mb-4">
                                    <p class="text-lg font-semibold text-gray-700">${q.text}</p>
                                    <div class="flex space-x-4 mt-4">
                                        <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors" data-choice="true">✔</button>
                                        <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors" data-choice="false">❌</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (exercise.type === 'yes-no') {
                html = `
                    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                        <img src="${exercise.image}" alt="Imagen del ejercicio" class="w-full h-auto rounded-xl mb-8">
                        <div class="grid grid-cols-1 gap-4">
                            ${exercise.questions.map((q, index) => `
                                <div class="bg-blue-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between game-card" data-index="${index}">
                                    <p class="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">${q.text}</p>
                                    <div class="flex space-x-4 mt-2 sm:mt-0">
                                        <button class="button-primary bg-green-500 hover:bg-green-600" data-choice="true">Yes</button>
                                        <button class="button-primary bg-red-500 hover:bg-red-600" data-choice="false">No</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;

            } else if(exercise.type === 'letter'){
                  html = `
                        <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                            <div id="typing-game-questions" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                ${exercise.questions.map((q, index) => `
                                    <div class="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center game-card" data-index="${index}">
                                        <img src="${q.image[0]}" alt="Ejercicio ${index + 1}" class="question-image rounded-lg mb-4">
                                        <div id="text-display-${index}" class="typing-text mb-4"></div>
                                        <input type="text" id="typing-input-${index}" class="typing-input" placeholder="Escribe aquí..." data-answer="${q.answer}" />
                                        <img src="${q.image[1]}" alt="" class="question-image rounded-lg mb-4 hidden">
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
            } else if(exercise.type === 'letter2'){
                  html = `
                        <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                            <div id="typing-game-questions" >
                                ${exercise.questions.map((q, index) => `
                                    <div class="bg-blue-50 p-4 rounded-xl flex  items-center justify-center game-card" data-index="${index}">
                                        <img src="${q.image[0]}" alt="Ejercicio ${index + 1}" class="question-image rounded-lg mb-4">
                                        <div class"flex flex-col items-center justify-center">
                                            <div id="text-display-${index}" class="typing-text mb-4"> </div>
                                            <input type="text" id="typing-input-${index}" class="typing-input" placeholder="Escribe aquí..." data-answer="${q.answer}" />
                                        </div>
                                        <img src="${q.image[1]}" alt="" class="question-image rounded-lg mb-4 ">
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
            } else if(exercise.type === 'Textwrite'){
                  html = `
                        <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl mx-auto text-center">
                            <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                            <img src="${exercise.image[0]}" alt="Imagen del ejercicio" class="w-full h-auto rounded-xl mb-8">
                            <div id="typing-game-questions" >
                                <div class="bg-blue-50 p-4 rounded-xl game-card" data-index="${exercise.id}">
                                    ${exercise.questions.map((q, index) => `
                                        <div id="text-display-${index}" class="typing-text mb-4 hidden"> </div>
                                        <span class="text-2xl font-bold "> ${q.text}  </span>
                                        <input type="text" id="typing-input-${index}" class="typing-input" placeholder="Escribe aquí..." data-answer="${q.answer}" />
                                     
                                    `).join('')}
                                    <button id="check-btn-${exercise.questions.id}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                    <button id="check-btn-${exercise.questions.id}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                </div>
                            <img src="${exercise.image[1]}" alt="Imagen del ejercicio" class="w-full h-auto rounded-xl mb-8">
                            </div>
                        </div>
                    `;
            }  

            gameContainer.innerHTML = html;
            addEventListeners(exercise.type);
        }

        // Función para añadir los listeners a los botones y inputs
        function addEventListeners(type) {
            if (type === 'tick-cross' || type === 'yes-no') {
                const gameCards = document.querySelectorAll('.game-card');
                gameCards.forEach(card => {
                    const buttons = card.querySelectorAll('button');
                    buttons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            handleAnswer(card, e.target.dataset.choice, type);
                        });
                    });
                });
            } else if (type === 'letter' || type === 'letter2' ) {
                const questionsContainer = document.getElementById('typing-game-questions');
                questionsContainer.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        handleTyping(e.target, type);
                    });
                });
            }else if (type === 'Textwrite') {
                const questionsContainer = document.getElementById('typing-game-questions');
                questionsContainer.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        handleTyping(e.target, type);
                    });
                });
            }
        }

        // Lógica para manejar las respuestas del usuario
        function handleAnswer(card, userChoice, type) {
            const index = parseInt(card.dataset.index);
            const exercise = exercises[currentExerciseIndex];
            let isCorrect;

            // La respuesta correcta es un booleano, convertimos el userChoice a booleano
            const userAnswer = userChoice === 'true'; 
            isCorrect = userAnswer === exercise.questions[index].answer;

            if (isCorrect) {
                card.classList.add('correct');
            } else {
                card.classList.add('incorrect');
            }

            // Deshabilitar los botones después de responder
            card.querySelectorAll('button').forEach(button => {
                button.disabled = true;
            });

            // Verificar si el ejercicio está completo
            checkExerciseCompletion();
        }

        
        // Lógica para el juego de escribir
        function handleTyping(input,type) {
            const index = input.id.split('-')[2];
            const card = input.closest('.game-card');
             console.log(input)
            const textDisplay = document.getElementById(`text-display-${index}`);
            const correctAnswer = input.dataset.answer;

            renderTypingText(textDisplay, input.value, correctAnswer);

            // Verificar si la respuesta es correcta
            if (input.value.toLowerCase() === correctAnswer.toLowerCase()) {
                if(!type === 'Textwrite'){
                    card.classList.add('correct');
                    input.disabled = true;
                    // Deshabilitar los botones después de responder
                    card.querySelectorAll('button').forEach(button => {
                        button.disabled = true;
                    });
                }

                checkExerciseCompletion();
            }
        }
        // Función para renderizar el texto con colores
        function renderTypingText(displayElement, userInput, correctAnswer) {
            let html = '';
            const correctLen = correctAnswer.length;
            const userLen = userInput.length;

            for (let i = 0; i < correctLen; i++) {
                if (i < userLen && userInput[i].toLowerCase() === correctAnswer[i].toLowerCase()) {
                    html += `<span class="correct-char">${correctAnswer[i]}</span>`;
                } else {
                    html += `<span>_</span>`;
                }
            }
            displayElement.innerHTML = html;
        }


        // Función para verificar si todas las preguntas del ejercicio actual han sido respondidas
        function checkExerciseCompletion() {
            //const answeredCards = document.querySelectorAll('.game-card button:disabled');
            const answeredCards = document.querySelectorAll('.game-card button:disabled');
            const totalQuestions = exercises[currentExerciseIndex].questions.length * 2 ; // * 2 Cada pregunta tiene dos botones
            
            if (answeredCards.length === totalQuestions) {
                showModal('¡Bien hecho!', 'Has completado este ejercicio. ¡Sigue así!', () => {
                    currentExerciseIndex++;
                    if (currentExerciseIndex < exercises.length) {
                        renderExercise(exercises[currentExerciseIndex]);
                    } else {
                        showModal('¡Felicidades!', '¡Has completado todos los ejercicios!', () => {
                             // Reiniciar el juego o mostrar una pantalla final
                             currentExerciseIndex = 0;
                             renderExercise(exercises[currentExerciseIndex]);
                        });
                    }
                });
            }
        }

        // Función para mostrar un mensaje flotante (modal)
        function showModal(title, message, onCloseCallback) {
            messageBox.innerHTML = `
                <h3 class="text-2xl font-bold text-blue-700 mb-4">${title}</h3>
                <p class="text-lg text-gray-700 mb-6">${message}</p>
                <button id="close-modal-btn" class="button-primary">Continuar</button>
            `;
            messageBoxContainer.classList.remove('hidden');

            document.getElementById('close-modal-btn').addEventListener('click', () => {
                messageBoxContainer.classList.add('hidden');
                if (onCloseCallback) {
                    onCloseCallback();
                }
            });
        }

        // Iniciar la aplicación
        document.addEventListener('DOMContentLoaded', () => {
            renderExercise(exercises[currentExerciseIndex]);
        });