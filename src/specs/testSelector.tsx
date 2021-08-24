import type {ReactTestInstance} from 'react-test-renderer';

export function testSelector(selector = ''): (instance: ReactTestInstance) => boolean {
    const [type, ...classNames] = selector.split('.');
    return instance => {
        if (type && instance.type !== type) {
            return false;
        }
        const {className = ''} = instance.props;
        const instanceClassNames = (className as string).split(' ');
        return classNames.every(className => instanceClassNames.includes(className));
    };
}
