# CampusFind-AI: Project Overview

## Primary Objective

The primary objective of CampusFind-AI is to develop an intelligent platform that simplifies the process of reporting, searching, matching, and recovering lost belongings within a campus.

- Develop a centralized digital platform for managing lost and found items.
- Provide secure registration and authentication for students and administrators.
- Allow users to create detailed lost-item and found-item reports.
- Support image uploads along with textual descriptions.
- Maintain structured information regarding item category, location, and date/time.
- Automatically identify potential matches between lost and found reports.
- Calculate similarity scores using multiple attributes.
- Provide reasons explaining why a particular pair of reports may represent a match.
- Provide administrators with tools for reviewing and managing potential matches.
- Maintain the status of reports and matches throughout their lifecycle.
- Reduce manual effort and searching time involved in recovering lost belongings.
- Provide a scalable architecture that can support more advanced AI models in the future.

## Methodology

The development of CampusFind-AI will follow a structured software development methodology consisting of the following phases:

1. **Requirement Analysis**
The requirements of students, administrators, and other campus users will be identified. The major requirements include reporting lost and found items, searching reports, uploading item images, managing reports, and identifying possible matches between lost and found items.

2. **System Design**
The overall system architecture, database structure, API structure, user roles, and application workflow will be designed. The system will consist of a frontend interface, backend REST APIs, MongoDB database, and AI-based matching service.

3. **Database Development**
MongoDB will be used to store user accounts, lost reports, found reports, categories, locations, notifications, and AI-generated match information. Appropriate indexes and relationships through MongoDB references will be implemented for efficient retrieval.

4. **Backend Development**
A RESTful backend will be developed using Node.js and Express.js. Authentication, authorization, report management, administrative functions, matching operations, and other business logic will be implemented through modular controllers, services, routes, models, and middleware.

5. **Frontend Development**
A responsive web interface will be developed using a modern frontend framework/library. A component-based UI library will be used to provide a consistent and user-friendly interface for students and administrators.

6. **AI-Based Matching**
The system will analyze information from lost and found reports and calculate a matching score using relevant attributes such as:
   - Item description/text similarity
   - Image similarity
   - Category similarity
   - Location similarity
   - Time/date proximity

   These individual scores will be combined to generate an overall matching score. Potential matches will then be presented to the appropriate users or administrators for review.

7. **Testing and Validation**
Individual modules and APIs will be tested using tools such as Postman. Integration testing will verify communication between the frontend, backend, database, and AI matching components. Authentication, authorization, report creation, matching, and administrative functions will also be tested.

8. **Deployment and Maintenance**
After successful testing, the system will be prepared for deployment. Logs, error handling, database backups, security controls, and future model improvements will be considered to support continued operation.

## Tools and Platforms Used

| Category | Technology |
| --- | --- |
| **Frontend** | React |
| **UI Framework** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Backend Runtime** | Node.js |
| **Backend Framework** | Express.js |
| **Database** | MongoDB |
| **Database ODM** | Mongoose |
| **API Architecture** | REST |
| **API Testing** | Postman |
| **Authentication** | Token-based authentication |
| **Password Security** | bcrypt |
| **Version Control** | Git |
| **Repository** | GitHub |
| **Development Environment** | Antigravity / VS Code |
| **AI/NLP** | Sentence Embeddings / NLP |
| **Computer Vision** | Image Similarity / Vision Models |
| **Charts** | Recharts |
| **Icons** | Lucide React |

## Conclusion

CampusFind-AI is expected to provide a centralized and intelligent solution for managing lost and found items within educational institutions.
The system will simplify the reporting process, provide searchable records, and reduce the manual effort required to identify potential matches.
The major contribution of the proposed system is the integration of multimodal matching, where textual descriptions, images, categories, locations, and time information can collectively contribute to identifying potential matches.
The system will also provide explainable match results rather than presenting users with an unexplained similarity score. This can help administrators make more informed decisions while retaining human verification for final confirmation.

The proposed platform can subsequently be extended with:

- Advanced computer vision
- Improved semantic search
- Mobile applications
- Push notifications
- Campus maps
- QR-based item identification
- Personalized recommendations
- More sophisticated multimodal AI models
- Analytics for campus authorities

Therefore, CampusFind-AI has the potential to provide a practical, scalable, and intelligent improvement over traditional campus lost-and-found systems.
