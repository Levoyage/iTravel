package com.example.iTravel.controller;

import com.example.iTravel.model.User;
import com.example.iTravel.repository.UserRepository;
import com.example.iTravel.security.AuthEntryPointJwt;
import com.example.iTravel.service.FileStorageService;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    // 文件上传
    @CrossOrigin(origins = "http://i-travel-app.s3-website-us-east-1.amazonaws.com")
    @PostMapping("/upload_avatar")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String fileId = fileStorageService.addFile(file);
        logger.debug("File stored with ID: {}", fileId);

        // Retrieve the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Assume username is unique and used as principal

        logger.debug("Authenticated username: {}", username);

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user's avatar URL
        user.setAvatarUrl((new ObjectId(fileId)));
        userRepository.save(user);

        logger.debug("User avatar URL updated: {}", fileId);
        return ResponseEntity.ok().body(fileId);
    }

    @CrossOrigin(origins = "http://i-travel-app.s3-website-us-east-1.amazonaws.com")
    // 文件下载
    @GetMapping("/download_avatar/{fileId}")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable String fileId) throws IOException {
        GridFsResource resource = fileStorageService.getFileAsResource(fileId);
        if (resource == null) {
            logger.warn("File not found for ID: {}", fileId);
            return ResponseEntity.notFound().build();
        }
        logger.info("File found: {}", resource.getFilename());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(resource.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(new InputStreamResource(resource.getInputStream()));
    }
}
