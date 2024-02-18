const storageKey = 'new'; // Убедитесь, что ключ соответствует вашему хранилищу

const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    column1: [],
    column2: [],
    column3: [],
};

new Vue({
    el: '#app',
    data() {
        return {
            column1: initialData.column1,
            column2: initialData.column2,
            column3: initialData.column3,
            newCardTitle: '',
            newItemText: [],
            priority: '',
            showForm: false,
            showItemForm: false,
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
        }
    },
    methods: {
        handleCardPosition(card) {
            const totalItems = card.items.length;
            const completedItems = card.items.filter(item => item.completed).length;

            if (completedItems / totalItems > 0.5 && this.column1.includes(card)) {
                if (this.column2.length < 5) {
                    this.column1.splice(this.column1.indexOf(card), 1);
                    this.column2.push(card);
                } else {
                    alert("Второй столбец переполнен");
                }
            } else if (completedItems / totalItems === 1 && this.column2.includes(card)) {
                this.column2.splice(this.column2.indexOf(card), 1);
                this.column3.push(card);
                card.completedDate = new Date().toLocaleString();
            }
            this.saveData();
        },
        addCard() {
            if (this.newCardTitle !== '' && this.column1.length < 3) {
                const newCard = {
                    id: Date.now(),
                    title: this.newCardTitle,
                    items: this.newItemText.filter(item => item.trim() !== '').map(item => ({ text: item, completed: false })),
                    priority: this.priority,
                    completedDate: null
                };
                if (this.column1.length >= 3) {
                    alert('Первый столбец заполнен 3 карточками.');
                    this.column1 = JSON.parse(localStorage.getItem('column1')) || [];
                    this.column2 = JSON.parse(localStorage.getItem('column2')) || [];
                    this.column3 = JSON.parse(localStorage.getItem('column3')) || [];
                    return;
                }
                if (!this.priority) {
                    alert('Укажите приоритет задачи.');
                    return;
                }

                if (newCard.items.length < 3 || newCard.items.length > 5) {
                    alert('Пожалуйста, добавьте от 3 до 5 пунктов!');
                    return;
                }
                else if (this.newCardTitle !== '' && newCard.items.length >= 3 && newCard.items.length <= 5) {
                    this.column1.push(newCard);
                    this.handleCardPosition(newCard);
                    this.newCardTitle = '';
                    this.newItemText = [''];
                } else {
                    alert('Не более 5 пунктов!');
                }

                if (this.priority === 1) {
                    this.prioritizedColumn1.push(newCard);
                } else if (this.priority === 2) {
                    this.column2.push(newCard);
                    this.prioritizedColumn2.push(newCard);
                } else {
                    this.column3.push(newCard);
                    this.prioritizedColumn3.push(newCard);
                }

                this.newCardTitle = '';
                this.priority = 3;
                this.newItemText = [''];
                this.showForm = false;
                this.showItemForm = false;
                this.saveData();
            }
        },
        saveData() {
            localStorage.setItem(storageKey, JSON.stringify({ column1: this.column1, column2: this.column2, column3: this.column3 }));
        },
        addItem() {
            this.newItemText.push('');
        }
    }
})