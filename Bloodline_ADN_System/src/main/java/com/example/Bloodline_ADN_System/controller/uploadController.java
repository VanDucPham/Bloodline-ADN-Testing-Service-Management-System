package com.example.Bloodline_ADN_System.controller;

import com.example.Bloodline_ADN_System.config.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api")
public class uploadController {

    @Autowired
    private ImageUploadService imageUploadService;

    // Upload 1 ảnh
    @PostMapping("/single")
    public ResponseEntity<String> uploadSingle(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = imageUploadService.uploadSingle(file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Upload failed: " + e.getMessage());
        }
    }

    // Upload nhiều ảnh
    @PostMapping("/multiple")
    public ResponseEntity<List<String>> uploadMultiple(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> imageUrls = imageUploadService.uploadMultiple(files);
            return ResponseEntity.ok(imageUrls);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

//    @PostMapping("/admin/blog/upload-image")
//    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
//        String uploadDir = System.getProperty("user.dir") + "/upload/";
//        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//
//        try {
//            File dir = new File(uploadDir);
//            if (!dir.exists()) dir.mkdirs();
//
//            File saveFile = new File(uploadDir + fileName);
//            file.transferTo(saveFile);
//
//            String imageUrl = "http://localhost:8080/upload/" + fileName;
//            Map<String, String> response = new HashMap<>();
//            response.put("url", imageUrl);
//
//            return ResponseEntity.ok(response);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi lưu ảnh: " + e.getMessage());
//        }
//    }
@PostMapping("/admin/blog/upload-image")
public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
    try {
        String imageUrl = imageUploadService.uploadSingle(file);  // Upload lên Cloudinary
        Map<String, String> response = new HashMap<>();
        response.put("url", imageUrl);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
    }
}



}
