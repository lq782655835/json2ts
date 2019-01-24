export interface Data {
	id: number;
	jobId: string;
	jobName: string;
	userId: string;
	nodeList: string;
	batchHost: string;
	state: string;
	submitTime: number;
	startTime: number;
	endTime: number;
	fillState: number;
	gmtCreate: number;
	gmtUpdate: number;
}

export interface RootObject {
	code: number;
	message: string;
	data: Data;
}