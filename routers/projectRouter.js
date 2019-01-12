const projectDb = require("../data/helpers/projectDb");

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  projectDb
    .get()
    .then(projects => {
      projects[0]
        ? res.json(projects)
        : res
            .status(400)
            .json({ error: "there are currently no projects" });
    })
    .catch(err => {
      res.status(500).json({ error: "could not retrieve projects" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  projectDb
    .get(id)
    .then(project => {
      if(project[0]) {
        projectDb
        .getProjectActions(id)
        .then(actions => {
          res.status(200).json({...project, actions: actions})
        })
      } else {
        res.status(404).json({ error: "project does not exist" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "project could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const newProject = req.body;
  if (!newProject.project_name || typeof newProject.project_name !== "string" || newProject.project_name === "") {
    res.status(400).json({error: "project name is required and must be a string"})
  } else if (!newProject.project_completed || typeof newProject.project_completed !== "boolean") {
    res.status(400).json({error: "completed status is required and must be a boolean"})
  } else {
    projectDb
    .insert(newProject)
    .then(id => res.status(200).json(id))
    .catch(err => res.status(500).json({error: "trouble adding project"}))
  }
})

module.exports = router;