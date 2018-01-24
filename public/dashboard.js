const firebase = require('firebase');
const $ = require('jquery');
const _  = require('lodash');
const {TweenLite, TimelineMax, TweenMax} = require('gsap');
const Highcharts = require('highcharts');

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

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $("#userName").html(user.displayName);
            }
        });

        FBController.fetchProjects((projects) => {
             projects.forEach(project => {
                 const projectName = project.key;
                $("#todoTable").append('<li class="todoHeader">' +
                    '<div class="projectText">' + projectName + '</div>' +
                    '<input data-toggle="modal" data-target=".bd-example-modal-lg" type="image" src="../../assets/img/add.svg" class="addTodoButton"/>' +
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

        updateVisitedSitesWidget();
 });

function updateVisitedSitesWidget() {
    const date = moment().format('YYYY-MM-DD');
    $("#siteTrackerBody").html("");

    FBController.fetchVisitedSites({ date }, sites => {

        let numProductive = 0;
        let numUnproductive = 0;

        let totalVisitedSitesTime = 0;

        _.each(sites, site => {
            var rowHtml = "";

            rowHtml += '<tr>';
            rowHtml += '<td>' + site.percentage + '</td>';
            rowHtml += '<td>' + getDisplayTime(site.visitTime) + '</td>';
            rowHtml += '<td>' + site.link + '</td>';
            rowHtml += '</tr>';

            $("#siteTrackerBody").append(rowHtml);

            totalVisitedSitesTime += site.visitTime;

            if (site.unproductive) {
                numUnproductive++;
            } else {
                numProductive++;
            }

        });

        let visitedSites = _.map(sites, site => {
            return site;
        });

        visitedSites.sort((a, b) => {
            return b.visitTime - a.visitTime;
        });

        const maxSites = 5;

        let visitedSitesMinutes = [];

        let topVisitedSitesTime = 0;

        for(var i = 0; i < visitedSites.length; i++) {

            console.log("HII");

            if (i < maxSites) {
                const site = visitedSites[i];

                topVisitedSitesTime += site.visitTime;

                const httpIndex = site.link.indexOf("://");

                let dotIndex = site.link.indexOf(".com");
                let ext = ".com";

                if (dotIndex == -1) {
                    dotIndex = site.link.indexOf('.org');
                    ext = "org";

                    if (dotIndex == -1) {
                        dotIndex = site.link.indexOf(".io");
                        ext = ".io";
                    }
                }

                const shortenedLink = site.link.substring(httpIndex + 3, dotIndex) + ext;

                if (i == 0) {
                    visitedSitesMinutes.push({
                        name: shortenedLink,
                        y: site.visitTime,
                        sliced: true,
                        selected: true
                    });
                } else {
                    visitedSitesMinutes.push({
                        name: shortenedLink,
                        y: site.visitTime
                    });
                }

            } else {
                visitedSitesMinutes.push({
                    name: "Other",
                    y: totalVisitedSitesTime - topVisitedSitesTime
                });

                break;
            }

        }

        Highcharts.chart(document.getElementById('productivityChart'), {
            chart: {
                plotBackgroundColor: "transparent",
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: "transparent"
            },
            title: {
                text: 'Your Productivity Levels (Today)',
                style: {
                    color: "white"
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            series: [{
                name: 'Productivity',
                colorByPoint: true,
                data: [{
                    name: 'Productive',
                    y: numProductive
                }, {
                    name: 'Unproductive',
                    y: numUnproductive,
                    sliced: true,
                    selected: true
                }]
            }]
        });

        console.log(visitedSitesMinutes);

        Highcharts.chart(document.getElementById('sitesChart'), {
            chart: {
                plotBackgroundColor: "transparent",
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: "transparent"
            },
            title: {
                text: 'Your Top Visited Sites (Today)',
                style: {
                    color: "white"
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        distance: -70
                    }
                }
            },
            series: [{
                name: 'Visit Duration',
                colorByPoint: true,
                data: visitedSitesMinutes
            }]
        });
    });
}

function getDisplayTime(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours > 0) {
        return hours + "h";
    } else if (minutes > 0) {
        return minutes + "m"
    } else if (seconds > 0) {
        return seconds + "s"
    }
}

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