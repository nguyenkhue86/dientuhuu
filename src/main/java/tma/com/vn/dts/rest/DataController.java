package tma.com.vn.dts.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tma.com.vn.dts.model.ImageEntity;
import tma.com.vn.dts.service.ImageService;

import java.util.List;

@RestController
@RequestMapping(value = "/images")
public class DataController {
    @Autowired
    ImageService imageService;
    @RequestMapping(value = "",method = RequestMethod.GET,produces = { "application/json" })
    public ResponseEntity<List<ImageEntity>> getAll(){
        return new ResponseEntity<>(imageService.getAll(), HttpStatus.OK);
    }

    @RequestMapping(value = "/{id}",method = RequestMethod.GET,produces = { "application/json" })
    public ImageEntity getById(@PathVariable("id") Long id){
        return imageService.getById(id);
    }

    @PostMapping(value = "")
    public ResponseEntity<ImageEntity> addImage(@RequestBody ImageEntity imageEntity){
        return new ResponseEntity<>(imageService.create(imageEntity),HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ImageEntity> updateImage(@RequestBody ImageEntity imageEntity,@PathVariable("id")Long id){
        return new ResponseEntity<>(imageService.update(imageEntity,id),HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public void deleteImage(@PathVariable("id")Long id){
        imageService.delete(id);
    }
}
