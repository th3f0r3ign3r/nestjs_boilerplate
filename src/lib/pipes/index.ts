import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
      console.log(metadata);
      throw new BadRequestException("Provided ID isn't a valid Mongo ID.");
    }
    return value;
  }
}
