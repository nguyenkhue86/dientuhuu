package tma.com.vn.dts.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tma.com.vn.dts.model.UserEntity;
import tma.com.vn.dts.reponsitory.UserRepository;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    public List<UserEntity> getAll() {
        return userRepository.findAll();
    }

    public UserEntity getById(Long id) {
        return userRepository.getOne(id);
    }

}
