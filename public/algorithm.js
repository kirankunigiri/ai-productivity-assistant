{
	project: {
		id {
			completed: false
		}
	}
}

// Get all todos in list
var todoArr = [];
FBController.fetchProjects((projects) => {
	projects.forEach(project => {
        project.forEach(todo => {
            todoArr.append(todo.val());
        })
    })
})

// Sort the array by task duration
objs.sort(todoArr);

function compare(a,b) {
    if (a.hours*60 + b.minutes < b.hours*60 + b.minutes)
        return -1;
    if (a.hours*60 + b.minutes > b.hours*60 + b.minutes)
        return 1;
    return 0;
}

const project = getClosestProject()

// Get minimum project work time per day, x
var x = project.getRemainingMinutes()/project.getRemainingDays();
x = Math.max(x, 30);

// Get tasks from project x to complete on a day
// Add up tasks from the project until they become greater than the suggested daily work duration value
var workDuration = 0;
var workTasks = [];
project.getTasksSortedByDuration().forEach(task => {
	workDuration += task;
	if (workDuration > x) {
		workDuration -= task;
		break;
	} else {
		workDuration.append(task);
	}
});

// Other tasks - calculate remaining time
var remainingTime = AVAILABLE_WORK_TIME - workDuration;
var allTasks = getAllTasksSortedByDuration()
allTasks.forEach(task => {
	remainingTime -= task.duration();
	if (remainingTime < 0) {
		remainingTime -= task.duration();
		break;
	} else {
		workTasks.append(task);
	}
})