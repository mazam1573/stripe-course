
import {COURSES, findLessonsForCourse} from './db-data';

// import * as firebase from 'firebase';
import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';


var config = {
  // TODO copy-paste here your own config, taken from the Firebase dashboard
  apiKey: "AIzaSyD6y3c3Ld5x0aX9owZ1s-f-JOYxA8ac2MM",
  authDomain: "firsebase-course-ae99f.firebaseapp.com",
  projectId: "firsebase-course-ae99f",
  storageBucket: "firsebase-course-ae99f.firebasestorage.app",
  messagingSenderId: "898001843756",
  appId: "1:898001843756:web:a3fda357ff8ad0a5794389"
};

console.log("Uploading data to the database with the following config:\n");

console.log(JSON.stringify(config));

console.log("\n\n\n\nMake sure that this is your own database, so that you have write access to it.\n\n\n");

// const initFirebase = initializeApp(config);

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.firestore();

async function uploadData() {

  var batch = db.batch();

  const courses = db.collection('courses');


  Object.values(COURSES)
    .sort((c1:any, c2:any) => c1.seqNo - c2.seqNo)
    .forEach(async (course:any) => {

      const newCourse = removeId(course);

      const courseRef = await courses.add(newCourse);

      const lessons = courseRef.collection("lessons");

      const courseLessons = findLessonsForCourse(course.id);

      //console.log(`Adding ${courseLessons.length} lessons to ${course.description}`);

      courseLessons.forEach(async lesson => {

        const newLesson = removeId(lesson);

        await lessons.add(newLesson);

      });

    });

  return batch.commit();
}


function removeId(data:any) {

  const newData: any = {...data};

  delete newData.id;

  return newData;
}


uploadData()
  .then(() => {
    console.log("Writing data, exiting in 10 seconds ...\n\n");

    setTimeout(() => {

      console.log("\n\n\nData Upload Completed.\n\n\n");
      process.exit(0);

    }, 10000);

  })
  .catch(err => {
    console.log("Data upload failed, reason:", err, '\n\n\n');
    process.exit(-1);
  });

