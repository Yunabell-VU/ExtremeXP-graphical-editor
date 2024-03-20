# Black-Box Testing: Evaluating Response Behavior of POST New Model and Model Validation on EMF.cloud Server

The purpose of black-box testing is to assess the construct validity of the decision to utilize the EMF.cloud server for validating models within the ExtremeXP graphical editor.
The assumption is that if an **instance model** (i.e., the concrete model that conforms to the meta-model) **violates** the rules defined in the **associated meta-model**, the EMF.cloud server will **reject** the POST request to create this instance model on the server.

## Expected Requiments

This section enumerates the expected behavior provided by the EMF.cloud Server's POST new model API.

- **R01-POST-SUCCESS-RESPONSE**:
  A successful model post indicates that the model has been created and stored on the server. If a model is successfully posted to the server, the server shall return a response containing the information about the successful post. This enables the user to be notified of the successful post.

- **R02-POST-FAILURE-RESPONSE**:
  A failed model post indicates that the model was unable to be created and stored on the server. If a model post fails, the server shall respond to notify the user about the failure.

- **R03-POST-MODEL-CONSISTENCY**:
  If the model is successfully created and stored on the server via the new model POST endpoint, the stored model should be consistent with the model posted by the client. This consistency entails ensuring that there are no missing or additional instances between the posted and ultimately created model.

- **R04-POST-MODEL-VALIDATION**:
  The server shall reject the model creation request under the following circumstances:

  - **R04A-REJECT-SCHEMA-VIOLATION**:
    If the instance model violates the schema defined in the meta-model, the server shall reject the model creation request. Schema violations include:

    1. **Element Violation:** The model contains an element (e.g., Classifier, including classes, data types, enumerations, and type parameters) that is not defined in the meta-model.
    2. **Relationship Violation:** The model contains relationships between elements that are not consistent with the relationships defined in the meta-model.

  - **R04B-REJECT-CONSTRAINTS-VIOLATION**:
    If the instance model violates the constraints defined by the meta-model, the server shall reject the model creation request. Constraints consist of additional rules such as **multiplicity**, and **data type**.

## Test Cases

For readability and privacy reasons, _\<workspace>_ is used to indicate the correct path that stores the meta-model in the EMF.Cloud server and _\<wrong workspace>_ is used to indicates a wrong path in this section.

#### Test ID: TC01-CORRECT-MODEL

**Test Requirement:**

- R01-POST-SUCCESS-RESPONSE
- R03-POST-MODEL-CONSISTENCY

**Input Features:**

| Input Feature                 | Compliance | Description                                                                                   |
| :---------------------------- | :--------: | :-------------------------------------------------------------------------------------------- |
| Correct Ecore model reference |  &#10003;  | The instance model refers to the correct position that stores the meta-model.                 |
| Correct elements              |  &#10003;  | All elements in the instance model follows the element name defined in the meta-model.        |
| Correct relationship          |  &#10003;  | The instance model follows the relathionship defined in the meta-model.                       |
| Correct multiplicity          |  &#10003;  | The elements in the instance model follows the correct multiplicty defined in the meta-model. |
| Correct data type             |  &#10003;  | The parameters in each element has the correct data type defined in the meta-model.           |

**Test input:**

```json
{
  "data": {
    "$type": "<workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//Task",
        "$id": "//@node.0",
        "name": "Task"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.1",
        "name": "START"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.2",
        "name": "END"
      }
    ],
    "link": [
      {
        "$type": "<workspace>/workflow.ecore#//RegularLink",
        "$id": "//@link.0",
        "output": {
          "$type": "<workspace>/workflow.ecore#//Task",
          "$ref": "//@node.0"
        },
        "input": {
          "$type": "<workspace>/workflow.ecore#//EventNode",
          "$ref": "//@node.1"
        }
      },
      {
        "$type": "<workspace>/workflow.ecore#//RegularLink",
        "$id": "//@link.1",
        "output": {
          "$type": "<workspace>/workflow.ecore#//EventNode",
          "$ref": "//@node.2"
        },
        "input": {
          "$type": "<workspace>/workflow.ecore#//Task",
          "$ref": "//@node.0"
        }
      }
    ]
  }
}
```

**Corresponding Graph:**
![test-case-1](./img/test-case-1.png)

**Expected Outcome:**

- The expected outcome is an HTTP response with a status code equal to 200.
- The response payload should contain a message indicating that the model was successfully created
- The response payload should contain the created model stored on the EMF.cloud server.
- The returned model should have exactly the same elements as those contained in the posted model.

**Actual Outcome:**

```json
// Status Code: 200
{
  "type": "success",
  "data": {
    "$type": "<workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//Task",
        "$id": "//@node.0",
        "name": "task"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.1"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.2",
        "name": "END"
      }
    ],
    "link": [
      {
        "$type": "<workspace>/workflow.ecore#//RegularLink",
        "$id": "//@link.0",
        "output": {
          "$type": "<workspace>/workflow.ecore#//Task",
          "$ref": "//@node.0"
        },
        "input": {
          "$type": "<workspace>/workflow.ecore#//EventNode",
          "$ref": "//@node.1"
        }
      },
      {
        "$type": "<workspace>/workflow.ecore#//RegularLink",
        "$id": "//@link.1",
        "output": {
          "$type": "<workspace>/workflow.ecore#//EventNode",
          "$ref": "//@node.2"
        },
        "input": {
          "$type": "<workspace>/workflow.ecore#//Task",
          "$ref": "//@node.0"
        }
      }
    ]
  }
}
```

**Test Conclusion:**

- [x] Status code 200
- [x] Message indicates successful upload
- [x] Response contains model created in the server
- [ ] Returned model is consistent with the posted one

The model stored in the model in the test case is almost consistent with the posted model, except it removes the name of one EventNode that has the name "START". The "START" is the default value for the name attribute of the EventNode class.

**Test Result:**

- **R01-POST-SUCCESS-RESPONSE: PASS**
- **R03-POST-MODEL-CONSISTENCY: FAIL**

---

#### Test ID: TC02-INCORRECT-REFERENCE

**Test Requirement:**

- R02-POST-FAILURE-RESPONSE

**Input Features:**

| Input Feature                 | Compliance | Description                                                                         |
| :---------------------------- | :--------: | :---------------------------------------------------------------------------------- |
| Correct Ecore model reference |  &#10008;  | The instance model refers to the **incorrect position** that stores the meta-model. |

**Test Input:**

```json
{
  "data": {
    "$type": "<wrong workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//Task",
        "$id": "//@node.0",
        "name": "task"
      }
    ]
  }
}
```

**Expected Outcome**:

- The HTTP response should has an Error status code.
- The repsonse should contain an error message to indicate the type of error.

**Actual Outcome:**

```json
// Status Code: 200
```

**Test Conclusion:**

- [ ] Error status code
- [ ] Error message

The response contains a status code of 200, indicating an OK status. However, the post resulted in a failure, and nothing is stored on the server. The incorrect meta-model reference caused an internal server error, which is displayed in the server console: `Caused by: java.io.FileNotFoundException: <wrong workspace>/workflow.ecore (No such file or directory)`. However, the client cannot retrieve this information from the HTTP response alone.

**Test Result:**

- **R02-POST-FAILURE-RESPONSE: FAIL**

---

#### Test ID: TC03-NON-EXISTING-ELEMENT-NAME

**Test Requirement:**

- R04A-REJECT-SCHEMA-VIOLATION

**Input Features:**

| Input Feature    | Compliance | Description                                                                                                 |
| :--------------- | :--------: | :---------------------------------------------------------------------------------------------------------- |
| Correct elements |  &#10008;  | One of the **element** in the instance model uses the class name that is **not defined** in the meta-model. |

**Test Input:**

```json
// CompositeTask is not defined
{
  "data": {
    "$type": "<workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//CompositeTask",
        "$id": "//@node.0",
        "name": "task"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.1",
        "name": "START"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.2",
        "name": "END"
      }
    ]
  }
}
```

**Expected Outcome:**

- The server should reject this post and do not store the model in the server.

**Actual Outcome:**

```json
{
  "type": "success",
  "data": {
    "$type": "<workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.0"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.1",
        "name": "END"
      }
    ]
  }
}
```

**Test Conclusion:**

- [ ] Reject model creation request

The server does not reject model creation requests even if the model contains elements that do not exist in the meta-model. Instead, it deletes the undefined elements and stores the model without the violated elements.

**Test Result:**

- **R04A-REJECT-SCHEMA-VIOLATION: FAIL**
- **R03-POST-MODEL-CONSISTENCY: FAIL**

---

#### Test ID: TC04-INCORRECT-ELEMENT-USEAGE

**Test Requirement:**

- R04A-REJECT-SCHEMA-VIOLATION

**Input Features:**

| Input Feature    | Compliance | Description                                                                                                                           |
| :--------------- | :--------: | :------------------------------------------------------------------------------------------------------------------------------------ |
| Correct elements |  &#10008;  | One of the element in the instance model is **an abstract element** defined in the meta-model but instantiated in the instance model. |

**Test Input:**

```json
// Node is an abstract class.
{
  "data": {
    "$type": "<workspace>/workflow.ecore#//Workflow",
    "$id": "/",
    "node": [
      {
        "$type": "<workspace>/workflow.ecore#//Node",
        "$id": "//@node.0"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.1",
        "name": "START"
      },
      {
        "$type": "<workspace>/workflow.ecore#//EventNode",
        "$id": "//@node.2",
        "name": "END"
      }
    ]
  }
}
```

**Expected Outcome:**

- The server should reject the post request.

**Actual Outcome:**

```json
// Status code: 200.
```

**Test Conclusion:**

- [x] The server rejects the post request.

The inproper use of element results in server internal error:
`[JettyServerThreadPool-34] ERROR DefaultModelSynchronizer-1 - Execution Exception
java.util.concurrent.ExecutionException: java.lang.IllegalArgumentException: The class 'Node' is not a valid classifier`
However, the client can not retrieve this information from the HTTP response. The reponse only gives a 200 status ok without any payload.

**Test Result:**

- **R04A-REJECT-SCHEMA-VIOLATION: PASS**