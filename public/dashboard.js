const firebase = require('firebase');
const $ = require('jquery');
const _  = require('lodash');
const {TweenLite, TimelineMax, TweenMax} = require('gsap');

     $(document).ready(function () {
         const firebase = require('firebase');

        var config = {
            apiKey: "AIzaSyD-wUQCtIdu3UCuSZI0IG8wyLiIvqetn6A",
            authDomain: "ai-productivity-assistant.firebaseapp.com",
            databaseURL: "https://ai-productivity-assistant.firebaseio.com",
            projectId: "ai-productivity-assistant",
            storageBucket: "ai-productivity-assistant.appspot.com",
            messagingSenderId: "412582784739"
        };

        firebase.initializeApp(config);

        FBController.fetchProjects((projects) => {
             projects.forEach(project => {
                 const projectName = project.key;
                $("#todoTable").append('<li class="todoHeader">' +
                    '<div class="projectText">' + projectName + '</div>' +
                    '<input type="image" src="../../assets/img/add.svg" class="addTodoButton"/>' +
                    '</li>');

                project.forEach(todo => {

                    $('#todoTable').append(
                        '   			<li class="todo" id="' + todo.key + '">  ' +
                        '   				<img class="todoImage" src="../../assets/img/checkmark.svg" />  ' +
                        '   				<div class="todoText">' + todo.val().text + '</div>' +
                        '   				<ul class="detailButton">' +
                        '   					<li>' + todo.val().duration.hours + 'h ' + todo.val().duration.minutes + 'm</li>  ' +
                        '   					<li>' + todo.val().deadline + '</li>  ' +
                        '   				</ul>  ' +
                        '  			</li>  ');

                    const $node = $('#' + todo.key);
                    $node.data("uid", todo.key);
                    $node.data("projectName", projectName);
                    $node.data("completed", todo.val().completed);

                    if (todo.val().completed) {
                        completeNode($node);
                    }
                });

            });
    });


         const date = moment().format('YYYY-MM-DD');
        FBController.fetchVisitedSites({ date }, sites => {
            console.log(sites);

        });

        var tableHtml = "";











 });


function completeNode($node) {
    $node.data("completed", true);
    const {uid, projectName, completed } = $node.data();
    FBController.updateTodoState({ uid, projectName, completed });

	TweenMax.fromTo($node, 0.3, {
		css: {
			color: "#020202",
			backgroundColor: "#798de4"
		}
	}, {
		css: {
			color: "#97abcd",
			backgroundColor: "#242c4f",
		}
	});
}

function uncompleteNode($node) {
    $node.data("completed", false);
    const { uid, projectName, completed } = $node.data();
    FBController.updateTodoState({ uid, projectName, completed });

	TweenMax.fromTo($node, 0.3, {
		css: {
			color: "#97abcd",
			backgroundColor: "#242c4f"
		}
	}, {
		css: {
			color: "#020202",
			backgroundColor: "#798de4"
		}
	});
}

$(document).on('click', '.todo', function() {
    const node = $(this);
    const { completed } = node.data();

    if (completed) {
        console.log('NODE NOT NODE');
        uncompleteNode(node);
    } else {
        console.log('COMPLETED NODE');
        completeNode(node);
    }
});