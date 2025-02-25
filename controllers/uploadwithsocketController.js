const { format } = require("util");
const { bucket } = require("../config/firebase");

/**
 * Upload a file to Firebase Storage with real-time progress using Socket.io
 * @param {Object} file - The uploaded file from multer
 * @param {string} folder - The storage path
 * @param {Object} socket - The Socket.io instance (optional)
 * @param {string} socketEvent - The event name for progress updates (optional)
 * @returns {Promise<string>} - Public URL of uploaded file
 */
const uploadFile = async (file, folder, socket = null, socketEvent = "uploadProgress") => {
  try {
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/\s+/g, "_"); // Remove spaces
    const fileName = `${folder}/${timestamp}-${sanitizedFileName}`;
    const fileUpload = bucket.file(fileName);

    let uploadedBytes = 0;
    const totalBytes = file.buffer.length;

    // Create a stream to upload the file
    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    blobStream.on("error", (error) => {
      console.error("Upload Error:", error);
      if (socket) socket.emit(socketEvent, { status: "error", message: "File upload failed." });
    });

    blobStream.on("finish", async () => {
      try {
        // Make the file publicly accessible
        await fileUpload.makePublic();

        // Generate the public URL
        const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${fileName}`);

        // Notify the client that the upload is complete
        if (socket) socket.emit(socketEvent, { status: "complete", url: publicUrl });

        return publicUrl;
      } catch (error) {
        if (socket) socket.emit(socketEvent, { status: "error", message: "Failed to set file as public." });
        throw new Error("Failed to set file as public.");
      }
    });

    // Track upload progress and emit updates via Socket.io
    blobStream.on("drain", () => {
      uploadedBytes += 1024; // Estimate bytes uploaded
      const progress = Math.min((uploadedBytes / totalBytes) * 100, 100);
      
      if (socket) {
        socket.emit(socketEvent, { status: "uploading", progress: Math.round(progress) });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Upload Failed:", error);
    if (socket) socket.emit(socketEvent, { status: "error", message: "Failed to upload file." });
    throw new Error("Failed to upload file.");
  }
};
const addProject = async (req, res) => {
    try {
      // Validate request body
      const { error } = projectSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
  
      const projectId = Date.now().toString();
      const fileUrls = {};
  
      // Send a quick response to the user before starting the upload
      res.json({ message: "Project is being processed...", projectId });
  
      // Upload files asynchronously
      const uploadTasks = [];
  
      if (req.files) {
        if (req.files.images) {
          uploadTasks.push(
            Promise.all(
              req.files.images.map((file) =>
                uploadFile(file, `projects/${projectId}/images`)
              )
            ).then((urls) => (fileUrls.images = urls))
          );
        }
        if (req.files.video) {
          uploadTasks.push(
            uploadFile(req.files.video[0], `projects/${projectId}/videos`).then(
              (url) => (fileUrls.video = url)
            )
          );
        }
        if (req.files.ministerialDecision) {
          uploadTasks.push(
            uploadFile(req.files.ministerialDecision[0], `projects/${projectId}/ministerialDecision`).then(
              (url) => (fileUrls.ministerialDecision = url)
            )
          );
        }
        if (req.files.landOwnershipDocs) {
          uploadTasks.push(
            uploadFile(req.files.landOwnershipDocs[0], `projects/${projectId}/landOwnershipDocs`).then(
              (url) => (fileUrls.landOwnershipDocs = url)
            )
          );
        }
        if (req.files.constructionDocs) {
          uploadTasks.push(
            uploadFile(req.files.constructionDocs[0], `projects/${projectId}/constructionDocs`).then(
              (url) => (fileUrls.constructionDocs = url)
            )
          );
        }
        if (req.files.threeD) {
          uploadTasks.push(
            uploadFile(req.files.threeD[0], `projects/${projectId}/3D`).then(
              (url) => (fileUrls.threeD = url)
            )
          );
        }
      }
  
      // Run all uploads in parallel (background processing)
      Promise.all(uploadTasks)
        .then(async () => {
          // Save project data in Firestore after uploads complete
          const projectData = { ...req.body, fileUrls };
          await createProject(projectId, projectData);
          console.log("Project saved successfully!", projectData);
        })
        .catch((uploadError) => {
          console.error("Upload error:", uploadError);
        });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = { uploadFile };
