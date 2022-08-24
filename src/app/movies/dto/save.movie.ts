import { IsNotEmpty } from 'class-validator';

export class SaveMovie {
  @IsNotEmpty({
    message: 'name is required',
  })
  name: string;

  @IsNotEmpty({
    message: 'category is required',
  })
  category: string;

  @IsNotEmpty({
    message: 'duration is required',
  })
  duration: string;

  @IsNotEmpty({
    message: 'director is required',
  })
  director: string;

  @IsNotEmpty({
    message: 'age_group is required',
  })
  ageGroup: number;
}
