const chrono = require('chrono-node');

class TodoParser {

    static parseTodo(todoInput, projectName) {
        var todo = todoInput;
        var hour;
        var minute;

        // Parse hours
        if (todo.includes('hour')) {
            const index = todo.indexOf('hour') - 1;
            const index2 = todo.lastIndexOf(' ', index - 2);
            hour = todo.substring(index2, index);
        }
        // Parse minutes
        if (todo.includes('minute')) {
            const index = todo.indexOf('minute') - 1;
            const index2 = todo.lastIndexOf(' ', index - 2);
            minute = todo.substring(index2, index);
        }

        // Remove duration text

        // Get the start index of the duration (either hour or minute)
        const durationIndex = Math.max(todo.indexOf('hour'), todo.indexOf('minute'));
        // Get the beginning for the word 'for' closest to the duration keyword
        const indexFirst = todo.lastIndexOf('for', durationIndex);
        // Get the end of the duration phrase (use space because user can use 'hour' or 'hours')
        const durationEndIndex = todo.indexOf(' ', durationIndex);
        // Perform a check in case the endIndex is at the end and results to -1
        const indexLast = durationEndIndex != -1 ? durationEndIndex : todo.length;
        // Remove the duration
        todo = todo.substring(0, indexFirst) + todo.substring(indexLast, todo.length);

        // Parse date from chrono and convert to new date
        const oldDate = chrono.parseDate(todo);
        const date = moment(oldDate).format('YYYY-MM-DD-hh:mm');

        // Remove date text
        const { index, text } = chrono.parse(todo)[0];
        todo = todo.substring(0, index) + todo.substring(index + text.length);

        // Return as a todo object
        return {
            text: todo.trim(),
            deadline: date,
            duration: {
                hours: parseFloat(hour) || 0,
                minutes: parseFloat(minute) || 0
            },
            completed: false,
            projectName
        };
    }
}