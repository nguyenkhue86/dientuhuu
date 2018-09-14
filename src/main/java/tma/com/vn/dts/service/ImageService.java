package tma.com.vn.dts.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tma.com.vn.dts.model.ImageEntity;
import tma.com.vn.dts.reponsitory.ImageRepository;

import java.util.List;

@Service
public class ImageService {
    @Autowired
    ImageRepository imageRepository;

    public List<ImageEntity> getAll(){
        return imageRepository.findAll();
    }

    public ImageEntity getById(Long id){
        return imageRepository.getOne(id);
    }

    public ImageEntity create(ImageEntity imageEntity){
        return imageRepository.save(imageEntity);
    }

    public ImageEntity update(ImageEntity imageEntity,Long id){
        ImageEntity ie=imageRepository.getOne(id);
        ie.setName(imageEntity.getName());
        ie.setImg(imageEntity.getImg());
        ie.setDescription(imageEntity.getDescription());
        return ie;
    }

    public Boolean delete(Long id){
        imageRepository.delete(imageRepository.getOne(id));
        return true;
    }
}
