import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema({
    name:{
        type: String,
        reyqured: true,
    },
    description:{
        type: String,
        reyqured: true,
    },
    videos:[
        {
            type: mongoose.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner:{
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Playlist = mongoose.model("Playlist", playlistSchema)