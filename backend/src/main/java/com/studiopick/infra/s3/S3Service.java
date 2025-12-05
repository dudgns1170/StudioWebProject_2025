package com.studiopick.infra.s3;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.studiopick.global.exception.BusinessException;
import com.studiopick.global.exception.ErrorCode;
import com.studiopick.global.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3Service {

    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucket:studiopick-dev}")
    private String bucket;

    public String uploadFile(MultipartFile file, String directory) {
        if (!FileUploadUtil.isValidImageFile(file)) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "유효하지 않은 이미지 파일입니다");
        }

        String fileName = directory + "/" + FileUploadUtil.generateFileName(file.getOriginalFilename());

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            amazonS3.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), metadata));

            return amazonS3.getUrl(bucket, fileName).toString();
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage());
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            String fileName = extractFileName(fileUrl);
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, fileName));
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
        }
    }

    private String extractFileName(String fileUrl) {
        // URL에서 버킷 이름 이후의 경로 추출
        String bucketUrl = amazonS3.getUrl(bucket, "").toString();
        return fileUrl.replace(bucketUrl, "");
    }
}
