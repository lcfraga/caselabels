module.exports = function makeUserModel (mongoose) {
  const Schema = mongoose.Schema

  const userSchema = new Schema({
    id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  })

  return mongoose.model('NewUser', userSchema, 'users')
}
