import { Profile } from "../features/Profile"
import { Commands } from "../features/command/Commands"

export function AccountPage(){

    return <div className="space-y-10">
        <Profile/>
        <Commands/>
    </div>
}
