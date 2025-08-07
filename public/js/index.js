      // Definición de las preguntas y ejercicios
        const exercises = [
            // Ejercicio 1: "Look and read. Put a tick (✔) or a cross (X)"
            {   id: 'exercise-1',
                type: 'tick-cross',
                title: 'Ejercicio 1: Marca con ✔ o ❌',
                questions: [
                    {
                        image: '../img/e1aeroplane.png', // Placeholder para un reloj
                        text: 'This is a Aeroplane ?.',
                        answer: true
                    },
                    {
                        image: '../img/e1duck.png', // Placeholder para motorbikes
                        text: 'This is a Duck ?.',
                        answer: true
                    },
                    {
                        image: '../img/e1erase.png', // Placeholder para unos pantalones cortos
                        text: 'These are rules ?',
                        answer: false
                    },
                    {
                        image: '../img/e1eye.png', // Placeholder para una oreja
                        text: 'This is a nose.?',
                        answer: false
                    },
                    {
                        image: '../img/e1balloon.png', // Placeholder para limas
                        text: 'These are balloons.',
                        answer: true
                    },
                    {
                        image: '../img/e1chears.png', // Placeholder para raqueta de tenis
                        text: 'These are chairs.?',
                        answer: true
                    },
                    {
                        image: '../img/e1dress.png', // Placeholder para raqueta de tenis
                        text: 'This is a jacket?',
                        answer: false
                    },
                    {
                        image: '../img/e1book.png', // Placeholder para raqueta de tenis
                        text: 'This is a Glasses?',
                        answer: false
                    }
                
                ]
            },
            // Ejercicio 2: "Look and read. Write yes or no."
            {   id: 'exercise-2',
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
                        answer: false
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
            {   id: 'exercise-3',
                type: 'letter',
                title: 'Ejercicio 3: Ver la imagen y escribir el nombre',
                image: '', // Placeholder para la imagen de la página 10
                questions: [
                    {
                        image:'../img/e3boat.png',
                        text: '',
                        answer: 'BOAT'
                    },
                           {
                        image:'../img/e3helicopter.png',
                        text: '',
                        answer: 'HELICOPTER'
                    },
                           {
                        image:'../img/e3bike.png',
                        text: '',
                        answer: 'BIKE'
                    },
                           {
                        image:'../img/e3plane.png',
                        text: '',
                        answer: 'PLANE'
                    },
                           {
                        image:'../img/e3car.png',
                        text: '',
                        answer: 'CAR'
                    },
                           {
                        image:'../img/e3train.png',
                        text: '',
                        answer: 'TRAIN'
                    },
                ]
            },
            {   id: 'exercise-4',
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
                        text: 'the gbaby is sleeping on the table?',
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
                        answer: true
                    },
                ]
            }
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
                                        <img src="${q.image}" alt="Ejercicio ${index + 1}" class="question-image rounded-lg mb-4">
                                        <div id="text-display-${index}" class="typing-text mb-4"></div>
                                        <input type="text" id="typing-input-${index}" class="typing-input" placeholder="Escribe aquí..." data-answer="${q.answer}" />
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                        <button id="check-btn-${index}" class="button-primary bg-blue-500 hover:bg-blue-600 mt-4 hidden">Comprobar</button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
            } /* else if (exercise.type === 'yes-no') {
                html = `
                    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl mx-auto text-center">
                        <h2 class="text-3xl font-bold text-blue-600 mb-6">${exercise.title}</h2>
                       
                        <div class="grid grid-cols-1 gap-4">
                            ${exercise.questions.map((q, index) => `
                                <div class="bg-blue-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between game-card" data-index="${index}">
                                     <img src="${q.image}" alt="Imagen del ejercicio" class="question-image">
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
            } */

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
            } else if (type === 'letter') {
                const questionsContainer = document.getElementById('typing-game-questions');
                questionsContainer.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        handleTyping(e.target);
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
        function handleTyping(input) {
            const index = input.id.split('-')[2];
            const card = input.closest('.game-card');
            const textDisplay = document.getElementById(`text-display-${index}`);
            const correctAnswer = input.dataset.answer;

            renderTypingText(textDisplay, input.value, correctAnswer);

            // Verificar si la respuesta es correcta
            if (input.value.toLowerCase() === correctAnswer.toLowerCase()) {
                card.classList.add('correct');
                input.disabled = true;
                // Deshabilitar los botones después de responder
                card.querySelectorAll('button').forEach(button => {
                button.disabled = true;
                });
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