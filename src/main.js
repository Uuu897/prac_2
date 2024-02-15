const app = new Vue({
    el: '#app',
    data: {
        columns: [
            { id: 1, notes: [], maxCards: 3 },
            { id: 2, notes: [], maxCards: 5 },
            { id: 3, notes: [] }
        ],
        newNoteTitle: '',
        newNoteContent: '',
        newItemText: '',
        isFirstColumnBlocked: false
    },
    methods:{
        addNote(columnId){
            const column = this.columns.find(col => col.id === columnId);
            if(column && column.id === 1 && (!column.maxCards || column.notes.length < column.maxCards) && !this.isFirstColumnBlocked){
                column.notes.push({
                    title: this.newNoteTitle,
                    content: this.newNoteContent,
                    items: [
                        { text: '', done: false, title: '' },
                        { text: '', done: false, title: '' },
                        { text: '', done: false, title: '' }
                    ],
                    completedAt: null
                });
                this.newNoteTitle = '';
                this.newNoteContent = '';
            }
        },
        addItem(columnId) {
            const column = this.columns.find(col => col.id === columnId);
            if (column && column.notes.length > 0) {
                const note = column.notes[column.notes.length - 1];
                note.items.push({ text: this.newItemText, done: false });
                this.newItemText = '';
            }


        },
        addListItem(note) {
            note.items.push({
                text: '',
                done: false
            });
        },
        checkProgress(note, column) {
            const doneItems = note.items.filter(item => item.done).length;
            const totalItems = note.items.length;
            const progress = doneItems / totalItems;

            if (progress >= 1 && column.id < 3) {
                this.moveNote(column.id, column.id + 1, note);
                note.completedAt = new Date().toLocaleString();
            } else if (progress >= 0.5 && column.id === 1) {
                this.moveNote(column.id, column.id + 1, note);
            }
            }
});