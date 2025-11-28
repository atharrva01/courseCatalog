//paste your code here
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CourseCatalog {

    // Course structure
    struct Course {
        uint id;
        string title;
        string instructor;
        uint price; // in wei
    }

    // Array to store courses
    Course[] public courses;

    // Add a new course
    function addCourse(string memory _title, string memory _instructor, uint _price) public {
        uint courseId = courses.length;
        courses.push(Course(courseId, _title, _instructor, _price));
    }

    // Get details of a specific course
    function getCourse(uint _id) public view returns (uint, string memory, string memory, uint) {
        require(_id < courses.length, "Course does not exist");
        Course memory c = courses[_id];
        return (c.id, c.title, c.instructor, c.price);
    }

    // Returns total number of courses
    function totalCourses() public view returns(uint) {
        return courses.length;
    }
}
