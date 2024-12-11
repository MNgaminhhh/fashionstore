import { FlexBox } from "../../../../../flexbox";
import Profile from "../../../../../profile/Profile";

export default function ContentRight() {
  return (
    <FlexBox alignItems="center" gap={2}>
      <Profile />
    </FlexBox>
  );
}
