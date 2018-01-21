{
	project: {
		id {
			completed: false
		}
	}
}


const project = getClosestProject()

// Get minimum project work time per day, x
var x = project.getRemainingMinutes()/project.getRemainingDays();
x = Math.max(x, 30)

// Get tasks from project x to complete on a day
// Add up tasks from the project until they become greater than the suggested daily work duration value
var workDuration = 0
var workTasks = []
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