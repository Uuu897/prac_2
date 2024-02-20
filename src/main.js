new Vue({
    el: '#app',
    data() {
        return {
            column1: [],
            column2: [],
            column3: [],
            column1Prefs: {
                isEditable: true,
                cardsLimit: 3,
            },
            column2Prefs: {
                isEditable: true,
                cardsLimit: 5,
            },
            column3Prefs: {
                isEditable: true,
                cardsLimit: '',
            },
            newCardTitle: '',
            newItemText: [],
            minItemLength: 3,
            maxItemLength: 5,
            priority: '',
            showForm: false,
            showItemForm: false,
            lastCardId: 1,
            storageKey: 'new',
        };
    },
    computed: {
        prioritizedColumn1() {
            return this.column1.slice().sort((a, b) => a.priority - b.priority);
        },

        prioritizedColumn2() {
            return this.column2.slice().sort((a, b) => a.priority - b.priority);
        },

        prioritizedColumn3() {
            return this.column3.slice().sort((a, b) => a.priority - b.priority);
        },

        column1WithoutLimit() {
            return this.column1.length < this.column1Prefs.cardsLimit;
        },

        column2WithoutLimit() {
            return this.column2.length < this.column2Prefs.cardsLimit;
        },
    },
    methods: {
        handleCardPosition(card, item) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter((item) => item.completed).length;

            if (completedItems / totalItems < 0.5 && this.column2.includes(card)) {
                if (this.column1WithoutLimit && this.column1Prefs.isEditable) {
                    this.column2.splice(this.column1.indexOf(card), 1);
                    this.column1.push(card);
                } else {
                    this.$nextTick(() => {
                        item.completed = true;
                    });
                    alert('Первый столбец переполнен');
                }
            }
            if (
                completedItems / totalItems >= 0.5 &&
                this.column1.includes(card) &&
                this.column1Prefs.isEditable
            ) {
                if (this.column2WithoutLimit) {
                    this.column1.splice(this.column1.indexOf(card), 1);
                    this.column2.push(card);
                } else {
                    this.$nextTick(() => {
                        item.completed = false;
                    });
                    this.column1Prefs.isEditable = false;
                    alert('Второй столбец переполнен');
                }
            } else if (completedItems / totalItems === 1 && this.column2.includes(card)) {
                this.column1Prefs.isEditable = true;
                this.column2.splice(this.column2.indexOf(card), 1);
                this.column3.push(card);
                card.completedDate = new Date().toLocaleString();
            }
            this.saveData();
        },

        addCard() {
            if (!this.column1WithoutLimit) {
                alert(
                    `Первый столбец заполнен максимумом (${this.column1Prefs.cardsLimit}) карточек.`
                );
                return;
            }
            if (this.newCardTitle === '') {
                alert(`Введите название карточки`);
                return;
            }
            if (!this.priority) {
                alert('Укажите приоритет задачи.');
                return;
            }
            if (
                this.newItemText.length < this.minItemLength ||
                this.newItemText.length > this.maxItemLength
            ) {
                alert('Пожалуйста, добавьте от 3 до 5 пунктов!');
                return;
            }

            const innerItems = this.newItemText
                .filter((item) => item.trim() !== '')
                .map((item) => ({ text: item, completed: false }));

            const newCard = {
                id: this.lastCardId++,
                title: this.newCardTitle,
                items: innerItems,
                priority: this.priority,
                completedDate: null,
            };

            this.column1.push(newCard);
            this.handleCardPosition(newCard);

            this.newCardTitle = '';
            // this.priority = '3';
            this.newItemText = [];
            this.showForm = false;
            this.showItemForm = false;
            this.saveData();
        },

        deleteCard(id) {
            this.$nextTick(() => {
                this.column3 = this.column3.filter((card) => card.id !== id);
                this.saveData();
            });
        },

        showItemsForm() {
            this.$nextTick(() => {
                this.showItemForm = !this.showItemForm;
            });
        },

        saveData() {
            localStorage.setItem(
                this.storageKey,
                JSON.stringify({
                    column1: this.column1,
                    column2: this.column2,
                    column3: this.column3,
                })
            );
        },

        addItem() {
            if (!this.newItemText.length) {
                this.newItemText = Array.from(
                    { length: this.minItemLength },
                    (value) => (value = '')
                );
                return;
            }
            if (this.newItemText.length === this.maxItemLength) {
                alert(`Создано максимальное ${this.maxItemLength} количество микрозаметок`);
                return;
            } else {
                this.newItemText.push('');
            }
        },
    },

    created() {
        const storageData = localStorage.getItem(this.storageKey);
        const initialData = storageData
            ? JSON.parse(storageData)
            : {
                column1: [],
                column2: [],
                column3: [],
            };

        this.column1 = initialData.column1;
        this.column2 = initialData.column2;
        this.column3 = initialData.column3;

        //Инициализируем
        const allCards = [...this.column1, ...this.column2, ...this.column3];
        this.lastCardId =
            allCards.length > 0 ? Math.max(...allCards.map((card) => card.id)) + 1 : 1;
    },
});
