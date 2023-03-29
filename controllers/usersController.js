const User = require("../models/userModel");
const Message = require("../models/messageModel");
const bcrypt = require("bcrypt");
const ethers = require('ethers')
const { verifyMessage } = require('ethers/lib/utils');
const messageModel = require("../models/messageModel");

const types = {
  EditUsername: [
    { name: 'address', type: 'address' },
    { name: 'username', type: 'string' }
]
}
const domain = {
  name: 'chat',
  version: '1',
  // chainId: 1,
  // verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};
  module.exports.login = async (req, res, next) => {
    try {

      const { password } = req.body;
      if (password != "1234")
        return res.json({ msg: "Incorrect Passowrd ", status: false });
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      // if (!isPasswordValid)
      //   return res.json({ msg: "Incorrect Password", status: false });
      // delete user.password;
      return res.json({ status: true });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.register = async (req, res, next) => {
    try {
      const { address } = req.body;
      // const usernameCheck = await User.findOne({ username });
      // if (usernameCheck)
      //   return res.json({ msg: "Username already used", status: false });
      const addressCheck = await User.findOne({ address });
      if (addressCheck)
        return res.json({ msg: "Address already used", status: false });
      // const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
      });
      // delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.isValidName = async (req, res, next) => {
    try {
      const { username } = req.body;
      const usernameCheck = await User.findOne({ username: username });
      if (usernameCheck)
        return res.json({ status: false });
      
      return res.json({ status: true });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.loginOrRegister = async (req, res, next) => {
    try {
      const { address, isKraken, isWhale, isShark, isDolpin, isTurtle, isHolder, isLiquidityProvider } = req.body;
      let user = await User.findOne({ address: address });


      if (user) {
        user = await User.findByIdAndUpdate(
          user._id,
          { 
            isKraken: isKraken,
            isWhale: isWhale,
            isShark: isShark,
            isDolpin: isDolpin,
            isTurtle: isTurtle,
            isHolder: isHolder,
            isLiquidityProvider: isLiquidityProvider,
          },
          { new: true }
        );
        return res.json({ status: true, user });
      } else {
        user = await User.create({
          address,
          username: address,
          isKraken: isKraken,
          isWhale: isWhale,
          isShark: isShark,
          isDolpin: isDolpin,
          isTurtle: isTurtle,
          isHolder: isHolder,
          isLiquidityProvider: isLiquidityProvider,
        });
      }

      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setUserName = async (req, res, next) => {
    try {
      const { address, username, signature } = req.body;      
      const message = {
        type: 'EditUsername',
        address,
        username
      }
      // const signerAddr = await ethers.utils.verifyTypedData(domain, types['EditUsername'], message, signature);
      console.log("signed Message", signature)
      const signedAddress = verifyMessage(username, signature);
      if (signedAddress.toLowerCase() !== address.toLowerCase()) {
        return res.json({
          message: "Not Allowed"
        });
      }
      const query = { address: address }
      const update = { $set: {username: username}}
      
      let user = await User.findOne({ address: address });

      if (user.username != username) {
        const userData = await User.updateOne(
          query,
          update, 
         );
        return res.json({
          message: "Username Updated"
        });
      }
      return res.json({
        message: "Already Updated"
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setKraken = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const kraken = req.params.isKraken;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isKraken: kraken,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isKraken: userData.isKraken
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setWhale = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const whale = req.params.isWhale;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isWhale: whale,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isWhale: userData.isWhale
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setShark = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const shark = req.params.isShark;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isShark: shark,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isShark: userData.isShark
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setDolphin = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const dolphin = req.params.isDolphin;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isDolphin: dolphin,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isDolphin: userData.isDolphin
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setTurtle = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const turtle = req.params.isTurtle;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isTurtle: turtle,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isTurtle: userData.isTurtle
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setHolder = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const holder = req.params.isHolder;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isHolder: holder,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isHolder: userData.isHolder
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setLiquidityProvider = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const liquidityprovider = req.params.isLiquidityProvider;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isLiquidityProvider: liquidityprovider,
        },
        { new: true }
      );
      return res.json({
        userId: userData._id,
        isLiquidityProvider: userData.isLiquidityProvider
      });
    } catch (ex) {
      next(ex);
    }
  }

  module.exports.setAvatar = async (req, res, next) => {
    try {
      const { address, avatarImage } = req.body;
      const query = { address: address }
      const update = { $set: {avatarImage: avatarImage}}
      const userData = await User.updateOne(
        query,
        update,
        {upsert: true}, 
        function(err,doc) {
          if (err) { return; }
          else { console.log("Updated"); }
        });
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users  = await User.find({
        _id:{ $ne:req.params.id }
      }).select([
        "address",
        "username",
        "role",
        "isKraken",
        "isWhale",
        "isShark",
        "isDolphin",
        "isTurtle",
        "isHolder",
        "isLiquidityProvider",
        "avatarImage",
        "_id"
      ]);

      let promises = [];
      users.map((o) => {
        let promise = new Promise((resolve, reject) => {
          Message.countDocuments({
            $or:[ 
              { $and: [ {'sender':o._id}, {'receiver':req.params.id} ]}, 
              { $and: [ {'sender':req.params.id}, {'receiver':o._id} ]} 
            ]}, async function(err, count) {
              if(err){
                return res.status(500).send({error: "get users wrong "})
              } 
              if(count > 0) { 
                var num = 0;
                num = await Message.countDocuments({checked: false, receiver: req.params.id, sender: o._id})
                resolve({
                  ...o._doc,
                  count: num,
                  total: count
                })
              }
              resolve(null);
          })
        })
        promises.push(promise)
      })    
      Promise.all(promises).then((ones) => {

        return res.status(200).json(ones);
      }) 
    } catch (err) {
      next(err);
    }
  };

  module.exports.searchUser = async (req, res, next) => {
    try {
      let regex = new RegExp(req.body.keyword, 'i') // i for case insensitive
      const users  = await User.find({
        _id:{ $ne:req.body.id },
        username:{$regex: regex}
      }).select([
        "address",
        "username",
        "role",
        "isKraken",
        "isWhale",
        "isShark",
        "isDolphin",
        "isTurtle",
        "isHolder",
        "isLiquidityProvider",
        "avatarImage",
        "_id"
      ]);

      let promises = [];
      users.map((o) => {
        let promise = new Promise((resolve, reject) => {
          Message.countDocuments({checked: false, receiver: req.params.id, sender: o._id}, function(err, c) {
            o = {
              ...o._doc,
              count: c
            }
            resolve(o)
          });
        })
        promises.push(promise)
      })

      Promise.all(promises).then((ones) => {
        return res.json(ones);
      })        
    } catch (err) {
      next(err);
    }
  };

  module.exports.getUser = async (req, res, next) => {
    try {
      const { address } = req.body;
      const user  = await User.findOne(
        { "address": address}
      )
      console.log("user", user)
      return res.json(user);
    } catch (err) {
      next(err);
    }
  };

  module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };
